
/* ================================================================
   ARCHIVO: js/login.js
   ¿QUÉ HACE? Maneja el inicio de sesión.
   - Recoge correo y contraseña del formulario
   - Envía POST a /api/usuarios/login
   - Solo deja entrar a usuarios con rol "admin"
   - También maneja el modal de "olvidé contraseña"
   - Y el modal de registro de nuevo usuario
   
   VARIABLES PRINCIPALES QUE MANEJA:
   ├─ Frontend (navegador):
   │  ├─ correo: string - Email escrito por el usuario
   │  ├─ contraseña: string - Contraseña escrita por el usuario
   │  └─ user: object - Datos del usuario recibidos del backend
   │
   └─ Backend (servidor en localhost:8080):
      ├─ Recibe: { correo, contraseña }
      ├─ Busca el usuario en la base de datos
      ├─ Verifica que contraseña sea correcta
      └─ Devuelve: { id, nombre, correo, edad, rol, estado }
   ================================================================ */

   /* ================================================================
   SPORTFLOW ADMIN — LÓGICA DE LOGIN
   Archivo: js/login.js
   Descripción: Maneja el inicio de sesión, el modal de registro
   de nuevos usuarios y el modal de recuperación de contraseña.
   ================================================================ */
   
const API_BASE_URL = 'http://localhost:8080/api';
// ↑ Dirección donde está el servidor backend
// Cuando hacemos fetch a '/usuarios/login', se convierte en:
// http://localhost:8080/api/usuarios/login

async function apiRequest(path, options = {}) {
  /* ────────────────────────────────────────────────────────────
     ¿QUÉ HACE? Esta función envía una solicitud HTTP al backend
     
     FLUJO:
     1. Construye la URL completa: API_BASE_URL + path
     2. Envía la solicitud con fetch()
     3. Recibe la respuesta del servidor
     4. Convierte la respuesta a JSON
     5. Si hay error, lanza excepción
     6. Si todo bien, devuelve los datos
     
     PARÁMETROS:
     ├─ path: string - Ruta del endpoint (ej: '/usuarios/login')
     └─ options: object - Configuración de la solicitud:
        ├─ method: 'POST', 'GET', 'PUT', 'DELETE'
        ├─ headers: { 'Content-Type': 'application/json' }
        └─ body: JSON con los datos a enviar
     
     RETORNA:
     └─ data: Los datos devueltos por el backend (JSON parseado)
     
     EJEMPLO DE USO:
     const user = await apiRequest('/usuarios/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ correo: '...', contraseña: '...' })
     });
     ──────────────────────────────────────────────────────────── */
  
  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
  // ↑ fetch() es como hacer una "llamada telefónica" al servidor
  //   Le enviamos los datos (body) y esperamos respuesta

  const text = await response.text();
  // ↑ Obtenemos la respuesta como texto primero
  
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
      // ↑ Convertimos el texto a objeto JavaScript
      // Ejemplo: '{"id":1,"nombre":"Juan"}' → { id: 1, nombre: 'Juan' }
    } catch {
      data = text;
      // ↑ Si no es JSON válido, guardamos como texto
    }
  }

  if (!response.ok) {
    // ↑ Si la respuesta tiene error (status != 200-299)
    const message = data && typeof data === 'object' && data.message
      ? data.message
      : `Error ${response.status}`;
    throw new Error(message);
    // ↑ Lanzamos error para que lo capture el try-catch del frontend
  }

  return data;
  // ↑ Si todo bien, devolvemos los datos
}

function getUserName(user) {
  // ↑ Extrae el nombre del usuario para mostrarlo en la navbar
  return user?.nombre || user?.name || user?.correo?.split('@')[0] || 'Admin';
  // ↑ Intenta: nombre → name → parte del correo antes del @ → 'Admin' por defecto
}



document.addEventListener('DOMContentLoaded', () => {

  /* ── Referencias a los elementos del HTML ── */
  const loginBtn   = document.getElementById('loginBtn');
  const emailInput = document.getElementById('emailInput');
  const passInput  = document.getElementById('passInput');
  const errorMsg   = document.getElementById('errorMsg');


  /* ────────────────────────────────────────────────────────────────
     INICIAR SESIÓN - Función Principal
     
     Este es el CORAZÓN del sistema de login.
     Aquí es donde ocurre la magia de recibir variables.
     
     ORDEN DE PASOS:
     1. Obtener valores del formulario HTML
     2. Validar que no estén vacíos
     3. Enviar al backend por HTTP (POST)
     4. Recibir respuesta del backend
     5. Verificar el rol del usuario
     6. Guardar en localStorage
     7. Redirigir al dashboard
     ──────────────────────────────────────────────────────────── */
  async function tryLogin() {
    /* ═══════════════════════════════════════════════════════════════
       PASO 1: OBTENER LOS VALORES DEL FORMULARIO (Frontend Variables)
       ═══════════════════════════════════════════════════════════════
    */
    const correo = emailInput.value.trim();
    // ↑ VARIABLE 1: Obtiene lo que el usuario escribió en el campo email
    // ↑ Ejemplo: "profesor@sportflow.com"
    // ↑ .value → Obtiene el contenido del input HTML
    // ↑ .trim() → Elimina espacios al inicio/final
    
    const contraseña = passInput.value;
    // ↑ VARIABLE 2: Obtiene lo que el usuario escribió en el campo password
    // ↑ Ejemplo: "MiContraseña123"
    // ↑ Nota: No usamos .trim() en contraseña porque los espacios pueden ser intencionales

    /* ═══════════════════════════════════════════════════════════════
       PASO 2: VALIDAR QUE NO ESTÉN VACÍOS (Frontend Validation)
       ═══════════════════════════════════════════════════════════════
    */
    if (!correo || !contraseña) {
      // ↑ Si correo está vacío (-o) contraseña está vacía
      errorMsg.style.display = 'block';
      // ↑ Mostrar mensaje de error
      passInput.focus();
      // ↑ Poner el cursor en el campo de contraseña
      return; // ← PARA AQUÍ, no envía al backend
    }

    try {
      /* ═════════════════════════════════════════════════════════════════
         PASO 3: ENVIAR AL BACKEND (HTTP POST Request)
         ═════════════════════════════════════════════════════════════════
      */
      const user = await apiRequest('/usuarios/login', {
        // ↑ Llama a apiRequest() que hace el fetch() al backend
        // ↑ Le pasa: '/usuarios/login' (ruta completa: http://localhost:8080/api/usuarios/login)
        
        method: 'POST',
        // ↑ POST significa "enviar datos al servidor"
        // ↑ (GET = obtener, POST = crear/enviar, PUT = actualizar, DELETE = eliminar)
        
        headers: { 'Content-Type': 'application/json' },
        // ↑ Dice al servidor: "Te envío datos en formato JSON"
        
        body: JSON.stringify({ correo, contraseña }),
        // ↑ IMPORTANTE: Convierte el objeto JavaScript a JSON (texto)
        // ↑ Ejemplo:
        //    ANTES (JavaScript):  { correo: "profesor@sportflow.com", contraseña: "123" }
        //    DESPUÉS (JSON):      '{"correo":"profesor@sportflow.com","contraseña":"123"}'
        // ↑ Este JSON se envía AL SERVIDOR por HTTP
      });

      /* ═════════════════════════════════════════════════════════════════
         PASO 4: RECIBIR RESPUESTA DEL BACKEND (HTTP Response)
         ═════════════════════════════════════════════════════════════════
      */
      // El backend recibió: { correo: "profesor@sportflow.com", contraseña: "MiContraseña123" }
      // El backend hizo:
      //   1. Buscó usuario con ese correo en la base de datos
      //   2. Verificó que la contraseña coincida
      //   3. Si todo bien: devuelve el usuario con su información
      //   4. Si falla: devuelve error
      
      // Ahora 'user' contiene lo que devolvió el backend:
      // Ejemplo:
      // {
      //   "id": 1,
      //   "nombre": "Profesor Juan",
      //   "correo": "profesor@sportflow.com",
      //   "edad": 35,
      //   "rol": "admin",
      //   "estado": true
      // }

      /* ═════════════════════════════════════════════════════════════════
         PASO 5: VERIFICAR EL ROL DEL USUARIO (Frontend Logic)
         ═════════════════════════════════════════════════════════════════
      */
      // ── VERIFICACIÓN DE ROL ── 
      // Solo los administradores pueden acceder al sistema
      if (user.rol !== 'admin') {
        // ↑ Si el rol NO es "admin", bloquea el acceso
        // ↑ user.rol viene del backend, puede ser "admin", "user", "profesor", etc.
        
        errorMsg.textContent = 'Acceso denegado. Solo los administradores pueden ingresar.';
        // ↑ Actualiza el mensaje de error con uno personalizado
        
        errorMsg.style.display = 'block';
        // ↑ Muestra el mensaje de error
        
        passInput.value = '';
        // ↑ Limpia el campo de contraseña por seguridad
        
        passInput.focus();
        // ↑ Pone el cursor en el campo de contraseña
        
        return; // ← PARA AQUÍ, no permite el login
      }
      // ── FIN VERIFICACIÓN DE ROL ──

      /* ═════════════════════════════════════════════════════════════════
         PASO 6: GUARDAR EN LOCALSTORAGE (Frontend Memory)
         ═════════════════════════════════════════════════════════════════
      */
      localStorage.setItem('sf_user', getUserName(user));
      // ↑ localStorage es una "memoria" del navegador
      // ↑ Guarda: Clave='sf_user', Valor=nombre del usuario
      // ↑ Propósito: Recordar quién inició sesión (incluso si cierra el navegador)
      // ↑ Se usa en utils.js para mostrar "Hola, [Nombre]" en la navbar

      /* ═════════════════════════════════════════════════════════════════
         PASO 7: REDIRIGIR AL DASHBOARD (Frontend Navigation)
         ═════════════════════════════════════════════════════════════════
      */
      window.location.href = '2_dashboard.html';
      // ↑ Cambia la página actual por el dashboard
      // ↑ El usuario ve la pantalla de administración
      // ↑ ✅ LOGIN EXITOSO
      
    } catch (error) {
      /* ═════════════════════════════════════════════════════════════════
         MANEJO DE ERRORES
         ═════════════════════════════════════════════════════════════════
      */
      // Si ocurre cualquier error en el flujo anterior:
      // - Backend no responde
      // - Correo/contraseña incorrectos
      // - Error de red
      // - etc.
      
      errorMsg.style.display = 'block';
      // ↑ Mostrar mensaje de error (el backend envía el mensaje de error)
      
      passInput.value = '';
      // ↑ Limpiar contraseña por seguridad
      
      passInput.focus();
      // ↑ Poner cursor en el campo para que reintente
    }
  }

  /* Botón "Iniciar Sesión" */
  loginBtn.addEventListener('click', tryLogin);

  /* También funciona presionando Enter desde cualquier campo */
  emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') passInput.focus(); });
  passInput.addEventListener('keydown',  e => { if (e.key === 'Enter') tryLogin(); });

  /* Oculta el mensaje de error al volver a escribir */
  [emailInput, passInput].forEach(el => {
    el.addEventListener('input', () => errorMsg.style.display = 'none');
  });


  /* ----------------------------------------------------------------
     MODAL: OLVIDÉ MI CONTRASEÑA
     Muestra un formulario para ingresar el correo y recibir un enlace
     ---------------------------------------------------------------- */
  const forgotLink    = document.getElementById('forgotLink');
  const forgotModal   = document.getElementById('forgotModal');
  const forgotForm    = document.getElementById('forgotForm');
  const forgotSuccess = document.getElementById('forgotSuccess');
  const cancelModal   = document.getElementById('cancelForgot');
  const sendResetBtn  = document.getElementById('sendResetBtn');
  const closeSuccess  = document.getElementById('closeSuccess');
  const resetEmail    = document.getElementById('resetEmail');

  /* Abre el modal y muestra el formulario (oculta confirmación) */
  function openForgotModal() {
    forgotForm.style.display    = 'block';
    forgotSuccess.style.display = 'none';
    resetEmail.value            = '';
    resetEmail.style.borderColor = '';
    forgotModal.classList.add('active');
  }

  /* Cierra el modal */
  function closeForgotModal() {
    forgotModal.classList.remove('active');
  }

  /* Enlace "Olvidé mi contraseña" abre el modal */
  forgotLink.addEventListener('click', e => { e.preventDefault(); openForgotModal(); });

  /* Botón "Cancelar" cierra el modal */
  cancelModal.addEventListener('click', closeForgotModal);

  /* Botón "Entendido" (pantalla de éxito) cierra el modal */
  closeSuccess.addEventListener('click', closeForgotModal);

  /* Clic en el fondo oscuro cierra el modal */
  forgotModal.addEventListener('click', e => {
    if (e.target === forgotModal) closeForgotModal();
  });

  /* Botón "Enviar enlace": valida el correo y muestra confirmación */
  sendResetBtn.addEventListener('click', () => {
    const email = resetEmail.value.trim();
    if (!email || !email.includes('@')) {
      /* Resalta el campo en rojo si el correo no es válido */
      resetEmail.style.borderColor = '#ef4444';
      resetEmail.focus();
      return;
    }
    /* Correo válido: oculta el formulario y muestra confirmación */
    resetEmail.style.borderColor    = '';
    forgotForm.style.display        = 'none';
    forgotSuccess.style.display     = 'block';
  });


  /* ────────────────────────────────────────────────────────────────
     MODAL: REGISTRO DE NUEVO USUARIO
     
     Este es el SEGUNDO flujo importante: CREAR un nuevo usuario.
     Aquí se envían variables NUEVAS al backend.
     
     ORDEN DE PASOS:
     1. Usuario abre el modal "Regístrate aquí"
     2. Rellena: Nombre, Correo, Contraseña
     3. Hace clic en "Crear cuenta"
     4. JavaScript recoge los valores del formulario
     5. JavaScript valida los datos
     6. JavaScript ENVÍA al backend (POST /usuarios)
     7. Backend guarda el nuevo usuario
     8. Backend devuelve el usuario creado
     9. Frontend muestra mensaje de éxito
     ──────────────────────────────────────────────────────────── */
  const registerLink  = document.getElementById('registerLink');
  const registerModal = document.getElementById('registerModal');
  const cancelReg     = document.getElementById('cancelRegister');
  const submitReg     = document.getElementById('submitRegister');

  const regName  = document.getElementById('regName');   // Campo: Nombre
  const regEmail = document.getElementById('regEmail');  // Campo: Correo
  const regPass  = document.getElementById('regPass');   // Campo: Contraseña
  const regError = document.getElementById('regError');  // Mensaje de error

  /* Abre el modal de registro y limpia los campos */
  function openRegisterModal() {
    regName.value  = '';
    regEmail.value = '';
    regPass.value  = '';
    regError.style.display = 'none';
    registerModal.classList.add('active');
  }

  /* Cierra el modal de registro */
  function closeRegisterModal() {
    registerModal.classList.remove('active');
  }

  /* Enlace "Regístrate aquí" abre el modal */
  registerLink.addEventListener('click', e => { e.preventDefault(); openRegisterModal(); });

  /* Botón "Cancelar" cierra el modal */
  cancelReg.addEventListener('click', closeRegisterModal);

  /* Clic en el fondo oscuro cierra el modal */
  registerModal.addEventListener('click', e => {
    if (e.target === registerModal) closeRegisterModal();
  });

  /* ────────────────────────────────────────────────────────────────
     Botón "Crear cuenta": RECIBE y ENVÍA variables al backend
     ──────────────────────────────────────────────────────────── */
  submitReg.addEventListener('click', async () => {
    /* ═══════════════════════════════════════════════════════════════
       PASO 1: OBTENER LOS VALORES DEL FORMULARIO
       ═══════════════════════════════════════════════════════════════
    */
    const name  = regName.value.trim();
    // ↑ VARIABLE 1: Nombre del nuevo usuario
    // ↑ Ejemplo: "Profesor Juan"
    
    const email = regEmail.value.trim();
    // ↑ VARIABLE 2: Correo del nuevo usuario
    // ↑ Ejemplo: "profesor@sportflow.com"
    
    const pass  = regPass.value;
    // ↑ VARIABLE 3: Contraseña (sin trim porque los espacios pueden ser intencionales)
    // ↑ Ejemplo: "MiContraseña123"

    /* ═══════════════════════════════════════════════════════════════
       PASO 2: VALIDAR LOS DATOS EN EL FRONTEND
       ═══════════════════════════════════════════════════════════════
    */
    if (!name || !email.includes('@') || pass.length < 4) {
      // ↑ Verifica:
      //   - ¿El nombre no está vacío?
      //   - ¿El email contiene @?
      //   - ¿La contraseña tiene al menos 4 caracteres?
      
      regError.style.display = 'block';
      regError.textContent   = '⚠️ Completa todos los campos correctamente (contraseña mínimo 4 caracteres).';
      return;
      // ↑ Si falla, muestra error y NO envía al backend
    }

    try {
      /* ═════════════════════════════════════════════════════════════════
         PASO 3: CONSTRUIR EL OBJETO USUARIO
         ═════════════════════════════════════════════════════════════════
      */
      // Nota: Se envían MÁS variables además de las que escribió el usuario.
      // Esto se llama "valores por defecto" para nuevos usuarios:
      
      await apiRequest('/usuarios', {
        // ↑ Envía POST a: http://localhost:8080/api/usuarios
        
        method: 'POST',
        // ↑ POST = CREAR un nuevo usuario
        
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({
          nombre: name,
          // ↑ Lo que escribió el usuario
          
          correo: email,
          // ↑ Lo que escribió el usuario
          
          edad: 18,
          // ↑ VALOR POR DEFECTO: todos los nuevos usuarios empiezan con 18 años
          
          rol: 'user',
          // ↑ VALOR POR DEFECTO: nuevos usuarios tienen rol="user"
          // ↑ (No son "admin" automáticamente por seguridad)
          
          estado: true,
          // ↑ VALOR POR DEFECTO: la cuenta está activa desde el inicio
          
          contraseña: pass,
          // ↑ Lo que escribió el usuario
        }),
      });

      /* ═════════════════════════════════════════════════════════════════
         PASO 4: BACKEND RECIBE Y GUARDA
         ═════════════════════════════════════════════════════════════════
      */
      // El backend recibió:
      // {
      //   "nombre": "Profesor Juan",
      //   "correo": "profesor@sportflow.com",
      //   "edad": 18,
      //   "rol": "user",
      //   "estado": true,
      //   "contraseña": "MiContraseña123"
      // }
      
      // El backend:
      // 1. Valida que no exista otro usuario con el mismo correo
      // 2. Genera un ID automático (ej: 15)
      // 3. Guarda todos los datos en la base de datos
      // 4. Devuelve el usuario creado (SIN la contraseña por seguridad)

      /* ═════════════════════════════════════════════════════════════════
         PASO 5: ÉXITO - MOSTRAR MENSAJE
         ═════════════════════════════════════════════════════════════════
      */
      closeRegisterModal();
      // ↑ Cierra el modal
      
      alert(`✅ Cuenta creada para ${name}. Ya puedes iniciar sesión.`);
      // ↑ Muestra mensaje de éxito
      // ↑ El usuario puede ahora usar sus credenciales para login
      
    } catch (error) {
      /* ═════════════════════════════════════════════════════════════════
         MANEJO DE ERRORES
         ═════════════════════════════════════════════════════════════════
      */
      // Si algo falla:
      // - El backend devuelve error (ej: email ya existe)
      // - No hay conexión a internet
      // - Error de servidor
      // - etc.
      
      regError.style.display = 'block';
      regError.textContent   = '⚠️ No fue posible crear la cuenta en el backend.';
    }
  });

});