/* ================================================================
   SPORTFLOW ADMIN — UTILIDADES COMPARTIDAS
   Archivo: js/utils.js
   Descripción: Funciones y datos que usan TODAS las páginas.
   Este archivo se carga antes que cualquier otro JS.
   ================================================================ */


/* ----------------------------------------------------------------
   NAVBAR — Pone el nombre del usuario y activa el dropdown con CLIC
   (No con hover de CSS, para evitar que se cierre al mover el mouse)
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* Escribe "Hola, [Nombre]" en la navbar */
  const navNameEl = document.getElementById('navUserName');
  if (navNameEl) {
    navNameEl.textContent = 'Hola, ' + (localStorage.getItem('sf_user') || 'Admin');
  }

  /* Referencia al botón y al menú desplegable */
  const navUser  = document.querySelector('.nav-user');
  const dropdown = document.querySelector('.dropdown');

  if (navUser && dropdown) {

    /* Al hacer CLIC en el botón de usuario, abre o cierra el menú */
    navUser.addEventListener('click', (e) => {
      e.stopPropagation(); /* Evita que el clic se propague al document */
      const isOpen = dropdown.classList.toggle('open');
      navUser.classList.toggle('open', isOpen); /* Rota la flecha */
    });

    /* Al hacer clic en cualquier parte de la página, cierra el menú */
    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
      navUser.classList.remove('open');
    });

    /* Evita que un clic DENTRO del dropdown lo cierre */
    dropdown.addEventListener('click', (e) => e.stopPropagation());
  }

});


/* ----------------------------------------------------------------
   TOAST — Muestra una notificación flotante en la esquina inferior
   Uso: showToast('Mensaje aquí');
   ---------------------------------------------------------------- */
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');                    /* Lo hace visible */
  setTimeout(() => t.classList.remove('show'), duration); /* Lo oculta después */
}


/* ----------------------------------------------------------------
   DATOS — Productos del inventario guardados en localStorage
   Si no hay datos guardados, usa los productos por defecto
   ---------------------------------------------------------------- */

/* Lista de productos iniciales del sistema */
const DEFAULT_PRODUCTS = [
  {
    id: 'PRD-001',
    name: 'Nike Football Pro',
    category: 'Fútbol',
    stock: 45,
    price: 89.99,
    buyPrice: 55.00,
    img: '',
    desc: 'Balón oficial de fútbol Nike Football Pro con tecnología avanzada de vuelo.'
  },
  {
    id: 'PRD-002',
    name: 'Baloncesto Spalding Elite',
    category: 'Baloncesto',
    stock: 32,
    price: 65.50,
    buyPrice: 38.00,
    img: '',
    desc: 'Balón de baloncesto profesional Spalding Elite para canchas interiores.'
  },
  {
    id: 'PRD-003',
    name: 'Raqueta de Tenis Wilson',
    category: 'Tenis',
    stock: 18,
    price: 149.99,
    buyPrice: 90.00,
    img: '',
    desc: 'Raqueta de tenis Wilson de grafito con marco de alta resistencia.'
  },
  {
    id: 'PRD-004',
    name: 'Zapatillas Running Adidas',
    category: 'Calzado',
    stock: 67,
    price: 120.00,
    buyPrice: 72.00,
    img: '',
    desc: 'Zapatillas de running Adidas con tecnología de amortiguación Boost.'
  },
  {
    id: 'PRD-005',
    name: 'Colchoneta Yoga Premium',
    category: 'Fitness',
    stock: 53,
    price: 45.00,
    buyPrice: 22.00,
    img: '',
    desc: 'Colchoneta antideslizante de 6mm para yoga y pilates.'
  },
  {
    id: 'PRD-006',
    name: 'Balón Fútbol Adidas',
    category: 'Fútbol',
    stock: 28,
    price: 55.00,
    buyPrice: 32.00,
    img: '',
    desc: 'Balón de fútbol Adidas con cuero sintético de alta durabilidad.'
  },
];

/* Lee los productos del localStorage (o usa los por defecto si no hay) */
function getProducts() {
  const saved = localStorage.getItem('sf_products');
  return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
}

/* Guarda el array de productos actualizado en localStorage */
function saveProducts(arr) {
  localStorage.setItem('sf_products', JSON.stringify(arr));
}