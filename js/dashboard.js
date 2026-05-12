/* ================================================================
   SPORTFLOW ADMIN — DASHBOARD / INVENTARIO
   Archivo: js/dashboard.js
   Descripción: Lógica de la tabla de productos: renderizado,
   búsqueda en tiempo real y eliminación con confirmación.
   ================================================================ */


document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------
     HELPERS — Funciones auxiliares para la tabla
     ---------------------------------------------------------------- */

  /* Devuelve la clase CSS del tag de categoría según su nombre
     Cada categoría tiene un color diferente definido en estilos.css */
  function catClass(cat) {
    const clases = {
      'Fútbol':     '',          /* Azul (por defecto) */
      'Calzado':    'calzado',   /* Verde */
      'Fitness':    'fitness',   /* Amarillo */
      'Baloncesto': 'baloncesto',/* Morado */
      'Tenis':      'tenis',     /* Naranja */
      'Natación':   'natacion',  /* Cian */
    };
    return clases[cat] || '';
  }

  /* Devuelve la clase CSS del stock según la cantidad:
     - verde  si hay 40 o más
     - amarillo si hay entre 20 y 39
     - rojo   si hay menos de 20 */
  function stockClass(n) {
    if (n >= 40) return 'stock-ok';
    if (n >= 20) return 'stock-mid';
    return 'stock-low';
  }


  /* ----------------------------------------------------------------
     RENDER TABLA — Construye las filas dinámicamente con JS
     Recibe un texto de búsqueda opcional para filtrar resultados
     ---------------------------------------------------------------- */
  function renderTable(filter = '') {
    const products = getProducts();             /* Lee del localStorage */
    const q = filter.toLowerCase();            /* Texto de búsqueda en minúsculas */

    /* Filtra los productos que coincidan con la búsqueda (ID, nombre o categoría) */
    const filtered = products.filter(p =>
      p.id.toLowerCase().includes(q)       ||
      p.name.toLowerCase().includes(q)     ||
      p.category.toLowerCase().includes(q)
    );

    /* Construye el HTML de cada fila y lo inyecta en el tbody */
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = filtered.map(p => `
      <tr>
        <!-- ID del producto -->
        <td><strong>${p.id}</strong></td>

        <!-- Imagen del producto o un placeholder gris si no tiene -->
        <td>
          ${p.img
            ? `<img src="${p.img}" class="product-img" alt="${p.name}">`
            : `<div class="img-placeholder">
                 <svg viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="#d1d5db">
                   <rect x="3" y="3" width="18" height="18" rx="2"/>
                   <circle cx="8.5" cy="8.5" r="1.5"/>
                   <polyline points="21 15 16 10 5 21"/>
                 </svg>
               </div>`
          }
        </td>

        <!-- Nombre del producto -->
        <td>${p.name}</td>

        <!-- Categoría con color dinámico -->
        <td><span class="tag ${catClass(p.category)}">${p.category}</span></td>

        <!-- Stock con color según cantidad -->
        <td><span class="stock-num ${stockClass(p.stock)}">${p.stock}</span></td>

        <!-- Precio de venta formateado con 2 decimales -->
        <td>$${Number(p.price).toFixed(2)}</td>

        <!-- Botones de editar y eliminar -->
        <td>
          <div class="actions">
            <button class="btn-icon btn-edit" data-id="${p.id}" title="Editar producto">
              <svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-icon btn-del" data-id="${p.id}" data-name="${p.name}" title="Eliminar producto">
              <svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    /* Actualiza el texto inferior con la cantidad de resultados */
    document.getElementById('tableFooter').textContent =
      `Mostrando ${filtered.length} de ${products.length} productos`;

    /* Agrega los eventos a los botones recién creados en el DOM */

    /* Botón editar: guarda el ID en localStorage y redirige */
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('sf_edit_id', btn.dataset.id);
        window.location.href = '4_editar.html';
      });
    });

    /* Botón eliminar: abre el modal de confirmación */
    tbody.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', () => askDelete(btn.dataset.id, btn.dataset.name));
    });
  }


  /* ----------------------------------------------------------------
     BUSCADOR — Filtra la tabla en tiempo real al escribir
     ---------------------------------------------------------------- */
  document.getElementById('searchInput').addEventListener('input', e => {
    renderTable(e.target.value); /* Vuelve a renderizar con el nuevo filtro */
  });


  /* ----------------------------------------------------------------
     ELIMINAR PRODUCTO — Modal de confirmación antes de borrar
     ---------------------------------------------------------------- */
  let deleteId = null; /* Guarda el ID del producto a eliminar */
  const delOverlay = document.getElementById('delOverlay');

  /* Abre el modal con el nombre del producto */
  function askDelete(id, name) {
    deleteId = id;
    document.getElementById('delMsg').textContent =
      `¿Eliminar "${name}"? Esta acción no se puede deshacer.`;
    delOverlay.classList.add('active');
  }

  /* Botón "Cancelar" cierra el modal sin hacer nada */
  document.getElementById('cancelDel').addEventListener('click', () => {
    delOverlay.classList.remove('active');
  });

  /* Botón "Eliminar" confirma: borra del array y actualiza la tabla */
  document.getElementById('confirmDel').addEventListener('click', () => {
    let products = getProducts();
  await fetch('http://localhost:8080/productos/' + deleteId, {
     method: 'DELETE'
  });
  renderTable();
    delOverlay.classList.remove('active');
    renderTable(document.getElementById('searchInput').value); /* Actualiza tabla */
    showToast('Producto eliminado correctamente');
  });

  /* Clic en el fondo oscuro cierra el modal */
  delOverlay.addEventListener('click', e => {
    if (e.target === delOverlay) delOverlay.classList.remove('active');
  });


  /* ── INICIO — Renderiza la tabla al cargar la página ── */
  renderTable();

});