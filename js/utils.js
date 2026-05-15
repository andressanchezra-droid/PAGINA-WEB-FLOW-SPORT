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
   API — Cliente compartido para el backend en localhost:8080
   ---------------------------------------------------------------- */
const API_BASE_URL = 'http://localhost:8080/api';
const PRODUCT_CACHE_KEY = 'sf_products_cache';
const USER_CACHE_KEY = 'sf_users_cache';

function normalizeProduct(product) {
  if (!product) return null;

  const rawId = product.id ?? product._id ?? product.codigo ?? '';
  const id = rawId === '' || rawId === null || rawId === undefined ? '' : String(rawId);

  return {
    id,
    name: product.name ?? product.nombre ?? '',
    category: product.category ?? product.categoria ?? '',
    stock: Number(product.stock ?? 0),
    price: Number(product.price ?? product.precio ?? 0),
    buyPrice: Number(product.buyPrice ?? product.precioCompra ?? 0),
    img: product.img ?? product.imagen ?? '',
    desc: product.desc ?? product.descripcion ?? '',
  };
}

function readCachedProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(PRODUCT_CACHE_KEY) || '[]');
    return Array.isArray(saved) ? saved.map(normalizeProduct).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeCachedProducts(products) {
  localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(products.map(normalizeProduct).filter(Boolean)));
}

function fallbackProducts() {
  return DEFAULT_PRODUCTS.map((product, index) => normalizeProduct({
    ...product,
    id: product.id || String(index + 1),
    nombre: product.name,
    categoria: product.category,
    precio: product.price,
  }));
}

function productToApiPayload(product) {
  return {
    nombre: product.name ?? product.nombre ?? '',
    precio: Number(product.price ?? product.precio ?? 0),
    stock: Number(product.stock ?? 0),
    categoria: product.category ?? product.categoria ?? '',
    desc: product.desc ?? product.descripcion ?? '',
    buyPrice: Number(product.buyPrice ?? product.precioCompra ?? 0),
    img: product.img ?? product.imagen ?? '',
  };
}

function normalizeUser(user) {
  if (!user) return null;

  const rawId = user.id ?? user._id ?? user.codigo ?? '';
  const id = rawId === '' || rawId === null || rawId === undefined ? '' : String(rawId);

  return {
    id,
    nombre: user.nombre ?? user.name ?? '',
    correo: user.correo ?? user.email ?? '',
    edad: Number(user.edad ?? 0),
    rol: user.rol ?? user.role ?? 'user',
    estado: Boolean(user.estado ?? user.status ?? false),
  };
}

function readCachedUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USER_CACHE_KEY) || '[]');
    return Array.isArray(saved) ? saved.map(normalizeUser).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeCachedUsers(users) {
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(users.map(normalizeUser).filter(Boolean)));
}

function userToApiPayload(user) {
  const payload = {
    nombre: user.nombre ?? user.name ?? '',
    correo: user.correo ?? user.email ?? '',
    edad: Number(user.edad ?? 0),
    rol: user.rol ?? user.role ?? 'user',
    estado: Boolean(user.estado ?? user.status ?? false),
  };

  const password = user.contraseña ?? user.password ?? '';
  if (password) {
    payload.contraseña = password;
  }

  return payload;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(API_BASE_URL + path, {
      // "fetch" es como hacer una llamada telefónica al backend
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
  // ... procesa la respuesta

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = data && typeof data === 'object' && data.message
      ? data.message
      : `Error ${response.status} al consultar ${path}`;
    throw new Error(message);
  }

  return data;
}

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

async function getProducts() {
  try {
    const data = await apiRequest('/productos');
    if (Array.isArray(data)) {
      const normalized = data.map(normalizeProduct).filter(Boolean);
      writeCachedProducts(normalized);
      return normalized;
    }
  } catch (error) {
    const cached = readCachedProducts();
    if (cached.length) return cached;
    return fallbackProducts();
  }

  return [];
}

function saveProducts(arr) {
  const normalized = Array.isArray(arr) ? arr.map(normalizeProduct).filter(Boolean) : [];
  writeCachedProducts(normalized);
  return normalized;
}

async function createProduct(product) {
  const data = await apiRequest('/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productToApiPayload(product)), // Convierte a JSON
  });
  // ...guarda también en caché local

  const created = normalizeProduct(data || product);
  const cached = readCachedProducts();
  const index = cached.findIndex(item => String(item.id) === String(created.id));

  if (index >= 0) {
    cached[index] = created;
  } else {
    cached.push(created);
  }

  writeCachedProducts(cached);
  return created;
}

async function updateProduct(id, product) {
  const data = await apiRequest('/productos/' + encodeURIComponent(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productToApiPayload({ ...product, id })),
  });

  const updated = normalizeProduct(data || { ...product, id });
  const cached = readCachedProducts();
  const index = cached.findIndex(item => String(item.id) === String(id));

  if (index >= 0) {
    cached[index] = updated;
  } else {
    cached.push(updated);
  }

  writeCachedProducts(cached);
  return updated;
}

async function deleteProduct(id) {
  await apiRequest('/productos/' + encodeURIComponent(id), {
    method: 'DELETE',
  });

  const cached = readCachedProducts().filter(item => String(item.id) !== String(id));
  writeCachedProducts(cached);
  return true;
}

async function getUsers() {
  try {
    const data = await apiRequest('/usuarios');
    if (Array.isArray(data)) {
      const normalized = data.map(normalizeUser).filter(Boolean);
      writeCachedUsers(normalized);
      return normalized;
    }
  } catch (error) {
    const cached = readCachedUsers();
    if (cached.length) return cached;
    throw error;
  }

  return [];
}

async function getUserById(id) {
  const data = await apiRequest('/usuarios/' + encodeURIComponent(id));
  return normalizeUser(data);
}


// ── CREAR USUARIO ──
// Esta función envía un POST al backend con los datos del nuevo usuario.
// El backend los valida, genera un ID automático y los guarda en:
//   → Memoria (Map<Long, Usuario>)
//   → Archivo: data/usuarios.json en IntelliJ

async function createUser(user) {
    // Envía POST a http://localhost:8080/api/usuarios
  const data = await apiRequest('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userToApiPayload(user)),
  });

  const created = normalizeUser(data || user);
  const cached = readCachedUsers();
  const index = cached.findIndex(item => String(item.id) === String(created.id));

  if (index >= 0) {
    cached[index] = created;
  } else {
    cached.push(created);
  }

  writeCachedUsers(cached);
  return created;
}

// ── EDITAR USUARIO ──
// Esta función envía un PUT al backend para actualizar un usuario.
// PUT significa "reemplaza todo el objeto con estos nuevos datos".
// La URL queda así: PUT http://localhost:8080/api/usuarios/3

async function updateUser(id, user) {
  const data = await apiRequest('/usuarios/' + encodeURIComponent(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userToApiPayload({ ...user, id })),
  });

  const updated = normalizeUser(data || { ...user, id });
  const cached = readCachedUsers();
  const index = cached.findIndex(item => String(item.id) === String(id));

  if (index >= 0) {
    cached[index] = updated;
  } else {
    cached.push(updated);
  }

  writeCachedUsers(cached);
  return updated;
}

// ── ELIMINAR USUARIO ──
// Envía DELETE al backend. Si el usuario existe, lo borra del Map
// y reescribe el archivo data/usuarios.json sin ese usuario.
async function deleteUser(id) {
  await apiRequest('/usuarios/' + encodeURIComponent(id), {
    method: 'DELETE',
  });

  const cached = readCachedUsers().filter(item => String(item.id) !== String(id));
  writeCachedUsers(cached);
  return true;
}