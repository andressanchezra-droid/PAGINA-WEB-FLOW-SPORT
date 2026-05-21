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
  // ═════════════════════════════════════════════════════════════════
  // TRANSFORMADOR DE VARIABLES PARA EL BACKEND
  // ═════════════════════════════════════════════════════════════════
  //
  // ¿QUÉ HACE?
  // Transforma un objeto usuario (JavaScript) a un objeto que entienda el backend
  // 
  // ¿POR QUÉ?
  // A veces el JavaScript usa nombres diferentes a los que espera el backend
  // Ej: JavaScript puede usar 'name', pero el backend espera 'nombre'
  //
  // EJEMPLO:
  // ENTRADA (JavaScript):
  // {
  //   nombre: "Juan",
  //   correo: "juan@example.com",
  //   email: "no se usa",
  //   name: "no se usa",
  //   edad: 25,
  //   rol: "admin",
  //   estado: true,
  //   contraseña: "123456"
  // }
  //
  // SALIDA (JSON para el backend):
  // {
  //   "nombre": "Juan",
  //   "correo": "juan@example.com",
  //   "edad": 25,
  //   "rol": "admin",
  //   "estado": true,
  //   "contraseña": "123456"
  // }
  // ═════════════════════════════════════════════════════════════════
  
  const payload = {
    // Usa el nombre si existe, si no, usa name, si no, usa vacío
    nombre: user.nombre ?? user.name ?? '',
    // ↑ ?? (operador Nullish Coalescing) = "usa el primero que no sea null/undefined"
    
    correo: user.correo ?? user.email ?? '',
    // ↑ El JavaScript puede tener 'correo' O 'email'
    // ↑ Aseguramos que el backend siempre recibe 'correo'
    
    edad: Number(user.edad ?? 0),
    // ↑ Convierte a número (si es string, lo convierte)
    // ↑ Si no existe, usa 0 por defecto
    
    rol: user.rol ?? user.role ?? 'user',
    // ↑ Puede ser 'rol' O 'role'
    // ↑ Si no existe, por defecto es 'user'
    
    estado: Boolean(user.estado ?? user.status ?? false),
    // ↑ Convierte a boolean (true/false)
    // ↑ Puede ser 'estado' O 'status'
    // ↑ Si no existe, por defecto es false (inactivo)
  };

  // SOLO si existe contraseña, la agrega al payload
  // (Por seguridad, no queremos enviar contraseña vacía o undefined)
  const password = user.contraseña ?? user.password ?? '';
  // ↑ Intenta: contraseña → password → vacío
  
  if (password) {
    // ↑ Si la contraseña NO está vacía
    payload.contraseña = password;
    // ↑ La agrega al objeto que se enviará al backend
  }

  return payload;
  // ↑ Devuelve el objeto transformado (listo para enviar al backend)
}

async function apiRequest(path, options = {}) {
  // ═════════════════════════════════════════════════════════════════
  // FUNCIÓN CENTRAL PARA COMUNICACIÓN CON EL BACKEND
  // ═════════════════════════════════════════════════════════════════
  //
  // ¿QUÉ HACE?
  // 1. Construye la URL completa (API_BASE_URL + path)
  // 2. Envía una solicitud HTTP al backend (GET, POST, PUT, DELETE)
  // 3. Recibe la respuesta del backend
  // 4. Convierte la respuesta de texto a JSON
  // 5. Si hay error, lanza una excepción
  // 6. Si todo bien, devuelve los datos
  //
  // PARÁMETROS:
  // ├─ path: string - Ruta del endpoint
  // │  Ejemplos: '/usuarios', '/usuarios/login', '/usuarios/5'
  // │
  // └─ options: object - Configuración de la solicitud
  //    ├─ method: 'POST', 'GET', 'PUT', 'DELETE'
  //    ├─ headers: { 'Content-Type': 'application/json' }
  //    └─ body: JSON con los datos a enviar (solo para POST/PUT)
  //
  // EJEMPLO DE LLAMADA:
  // const user = await apiRequest('/usuarios/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ correo: 'prof@...', contraseña: '...' })
  // });
  // ═════════════════════════════════════════════════════════════════
  
  const response = await fetch(API_BASE_URL + path, {
    // ↑ fetch() es la función de JavaScript para hacer solicitudes HTTP
    // ↑ API_BASE_URL = 'http://localhost:8080/api'
    // ↑ Ejemplo: fetch('http://localhost:8080/api/usuarios/login', {...})
    
    ...options,
    // ↑ Expande las opciones (method, headers, body)
    
    headers: {
      ...(options.headers || {}),
      // ↑ Mantiene los headers que fueron pasados
    },
  });
  // ↑ Aquí se envía la solicitud al servidor y esperamos respuesta
  
  // El servidor responde con:
  // - status: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 500 (Error), etc.
  // - body: Los datos (generalmente JSON)

  /* ────────────────────────────────────────────────────────────
     PASO 1: OBTENER LA RESPUESTA COMO TEXTO
     ──────────────────────────────────────────────────────────── */
  const text = await response.text();
  // ↑ Convierte la respuesta a texto (string)
  // ↑ Ejemplo: '{"id":1,"nombre":"Juan"}'
  
  let data = null;
  // ↑ Variable para guardar los datos parseados

  /* ────────────────────────────────────────────────────────────
     PASO 2: CONVERTIR EL TEXTO A JSON
     ──────────────────────────────────────────────────────────── */
  if (text) {
    // ↑ Si la respuesta tiene contenido (no está vacía)
    
    try {
      data = JSON.parse(text);
      // ↑ Convierte el texto JSON a objeto JavaScript
      // ↑ ANTES: '{"id":1,"nombre":"Juan"}'
      // ↑ DESPUÉS: { id: 1, nombre: 'Juan' }
      
    } catch {
      // ↑ Si el texto NO es JSON válido (por ej, es HTML de error)
      data = text;
      // ↑ Simplemente guarda el texto como está
    }
  }

  /* ────────────────────────────────────────────────────────────
     PASO 3: VERIFICAR SI HUBO ERROR
     ──────────────────────────────────────────────────────────── */
  if (!response.ok) {
    // ↑ response.ok es FALSE si el status no es 2xx (200-299)
    // ↑ Es decir, si hay cualquier error (4xx, 5xx, etc)
    
    const message = data && typeof data === 'object' && data.message
      ? data.message
      : `Error ${response.status} al consultar ${path}`;
    // ↑ Intenta obtener el mensaje de error del backend
    // ↑ Si no lo encuentra, crea un mensaje genérico
    // ↑ Ejemplo: "Error 401 al consultar /usuarios/login"
    
    throw new Error(message);
    // ↑ LANZA una excepción (error) que será capturada en el try-catch del llamador
    // ↑ Ejemplo de error:
    //    "El correo o contraseña son incorrectos"
    //    "El usuario ya existe"
    //    "Error 500 al consultar /usuarios"
  }

  /* ────────────────────────────────────────────────────────────
     PASO 4: TODO BIEN - DEVOLVER LOS DATOS
     ──────────────────────────────────────────────────────────── */
  return data;
  // ↑ Si response.ok es TRUE, devuelve los datos
  // ↑ Pueden ser NULL (si la respuesta estaba vacía)
  // ↑ O un objeto JavaScript con los datos del backend
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
// ═════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL PARA GUARDAR USUARIOS EN EL BACKEND
// ═════════════════════════════════════════════════════════════════
//
// Esta función es LLAMADA desde agregar-usuario.js
// Hace POST al backend con los datos del nuevo usuario
//
// FLUJO COMPLETO:
// 1. JavaScript (agregar-usuario.js) recoge variables del formulario
// 2. Llama a createUser() con esas variables
// 3. createUser() transforma variables a formato API
// 4. createUser() hace fetch() (HTTP POST) al backend
// 5. Backend recibe el JSON y guarda el usuario
// 6. Backend devuelve el usuario guardado (con ID generado)
// 7. createUser() recibe la respuesta
// 8. createUser() guarda en caché (localStorage)
// 9. createUser() devuelve el usuario al llamador
//
// PARÁMETRO:
// ├─ user: object con propiedades:
// │  ├─ nombre: string
// │  ├─ correo: string
// │  ├─ edad: number
// │  ├─ rol: string ("admin", "user", "profesor", etc)
// │  ├─ estado: boolean
// │  └─ contraseña: string
//
// RETORNA:
// └─ object: El usuario creado (con ID generado por backend)
// ═════════════════════════════════════════════════════════════════

async function createUser(user) {
  // ↑ Esta función RECIBE un objeto 'user' con los datos
  // ↑ Ejemplo:
  // {
  //   nombre: "Juan Perez",
  //   correo: "juan@example.com",
  //   edad: 25,
  //   rol: "admin",
  //   estado: true,
  //   contraseña: "123456"
  // }
  
  // PASO 1: Transforma el objeto user a formato API (en utils.js línea 149-164)
  // Esto asegura que las variables tengan los nombres correctos que espera el backend
  
  // PASO 2: Hace HTTP POST al backend
  const data = await apiRequest('/usuarios', {
    // ↑ URL: http://localhost:8080/api/usuarios
    // ↑ MÉTODO: POST (crear nuevo)
    
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userToApiPayload(user)),
    // ↑ Convierte el objeto user a JSON y lo envía en el body
    // ↑ El backend recibe este JSON
  });

  // PASO 3: Recibe la respuesta del backend y la normaliza
  const created = normalizeUser(data || user);
  // ↑ El backend devuelve algo como:
  // {
  //   "id": 5,
  //   "nombre": "Juan Perez",
  //   "correo": "juan@example.com",
  //   "edad": 25,
  //   "rol": "admin",
  //   "estado": true
  // }
  // ↑ normalizeUser() asegura que tenga el formato correcto
  
  // PASO 4: Actualiza el caché local (localStorage)
  const cached = readCachedUsers();
  // ↑ Obtiene los usuarios guardados en localStorage
  
  const index = cached.findIndex(item => String(item.id) === String(created.id));
  // ↑ Busca si este usuario ya está en caché (por el ID)

  if (index >= 0) {
    // ↑ Si ya existe en caché, lo actualiza
    cached[index] = created;
  } else {
    // ↑ Si no existe, lo agrega al final del array
    cached.push(created);
  }

  writeCachedUsers(cached);
  // ↑ Guarda los usuarios actualizados en localStorage
  // ↑ Propósito: No perder datos si se cierra el navegador

  return created;
  // ↑ Devuelve el usuario creado
  // ↑ El llamador (agregar-usuario.js) puede usarlo si quiere
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