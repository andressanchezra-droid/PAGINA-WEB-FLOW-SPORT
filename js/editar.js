/* ================================================================
   SPORTFLOW ADMIN — EDITAR PRODUCTO
   Archivo: js/editar.js
   Descripción: Carga los datos del producto seleccionado en el
   formulario, permite modificarlos y guardar los cambios.
   ================================================================ */


document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------
     CARGAR DATOS DEL PRODUCTO
     Lee el ID guardado por el dashboard y rellena el formulario
     ---------------------------------------------------------------- */
  const editId   = localStorage.getItem('sf_edit_id'); /* ID guardado al presionar editar */
  const products = getProducts();

  /* Busca el producto por ID; si no existe, usa el primero como fallback */
  let product = products.find(p => p.id === editId) || products[0];

  /* Actualiza el título de la página con el nombre del producto */
  document.getElementById('pageTitle').textContent = 'Editar Producto: ' + product.name;

  /* Muestra la fecha y hora actual como "última actualización" */
  const now = new Date();
  document.getElementById('pageDate').textContent =
    'Última actualización: ' +
    now.toLocaleDateString('es-CO') + ' ' +
    now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  /* Rellena cada campo del formulario con los datos del producto */
  document.getElementById('prodName').value  = product.name      || '';
  document.getElementById('prodDesc').value  = product.desc      || '';
  document.getElementById('prodCat').value   = product.category  || '';
  document.getElementById('prodStock').value = product.stock     || 0;
  document.getElementById('prodBuy').value   = product.buyPrice  || '';
  document.getElementById('prodSell').value  = product.price     || '';


  /* ----------------------------------------------------------------
     GESTIÓN DE IMAGEN
     Muestra la imagen actual si existe, o el cuadro de carga si no
     ---------------------------------------------------------------- */
  let imgData = product.img || ''; /* La imagen actual en base64 */

  /* Referencias a los elementos de imagen */
  const imgCurrentEl = document.getElementById('imgCurrent'); /* Div con imagen actual */
  const currentImgEl = document.getElementById('currentImg'); /* La etiqueta <img> */
  const changeImgBtn = document.getElementById('changeImgBtn');/* Enlace "Cambiar imagen" */
  const uploadArea   = document.getElementById('uploadArea'); /* Cuadro de carga */
  const fileInput    = document.getElementById('fileInput');  /* Input oculto de tipo file */

  /* Actualiza la UI de imagen según si hay imagen o no */
  function refreshImgUI() {
    if (imgData) {
      /* Hay imagen: muestra la preview y el botón de cambiar */
      currentImgEl.src           = imgData;
      imgCurrentEl.style.display = 'block';
      changeImgBtn.style.display = 'block';
      uploadArea.style.display   = 'none';
    } else {
      /* No hay imagen: muestra el cuadro de carga */
      imgCurrentEl.style.display = 'none';
      changeImgBtn.style.display = 'none';
      uploadArea.style.display   = 'block';
    }
  }

  /* Inicializa la UI de imagen al cargar la página */
  refreshImgUI();

  /* Botón "✕" rojo: elimina la imagen actual */
  document.getElementById('delImgBtn').addEventListener('click', () => {
    imgData = '';
    refreshImgUI(); /* Vuelve a mostrar el cuadro de carga */
  });

  /* Botón "Cambiar imagen" y cuadro punteado abren el explorador */
  changeImgBtn.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('click',   () => fileInput.click());

  /* Al seleccionar un nuevo archivo, lo procesa */
  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });

  /* Convierte el archivo de imagen a base64 y actualiza la UI */
  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes (PNG, JPG, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      imgData = ev.target.result; /* Guarda la nueva imagen en base64 */
      refreshImgUI();             /* Muestra la nueva imagen */
    };
    reader.readAsDataURL(file);
  }


  /* ----------------------------------------------------------------
     GUARDAR CAMBIOS
     Valida los campos, actualiza el producto y guarda en localStorage
     ---------------------------------------------------------------- */
  document.getElementById('saveBtn').addEventListener('click', () => {
    /* Lee todos los valores del formulario */
    const name  = document.getElementById('prodName').value.trim();
    const desc  = document.getElementById('prodDesc').value.trim();
    const cat   = document.getElementById('prodCat').value;
    const stock = document.getElementById('prodStock').value;
    const buy   = document.getElementById('prodBuy').value;
    const sell  = document.getElementById('prodSell').value;

    /* Validación básica: todos los campos obligatorios deben tener valor */
    if (!name || !desc || !cat || stock === '' || sell === '') {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    /* Busca el índice del producto en el array */
    const allProducts = getProducts();
    const idx = allProducts.findIndex(p => p.id === product.id);

    if (idx !== -1) {
      /* Actualiza solo los campos modificados, manteniendo el ID */
      allProducts[idx] = {
        ...allProducts[idx], /* Conserva todos los campos anteriores */
        name,
        desc,
        category: cat,
        stock:    parseInt(stock),
        buyPrice: parseFloat(buy) || 0,
        price:    parseFloat(sell),
        img:      imgData, /* Imagen nueva o la misma si no cambió */
      };
      saveProducts(allProducts); /* Persiste los cambios en localStorage */
    }

    /* Notifica y redirige al dashboard */
    showToast('Producto actualizado correctamente ✓');
    setTimeout(() => window.location.href = '2_dashboard.html', 1200);
  });

});