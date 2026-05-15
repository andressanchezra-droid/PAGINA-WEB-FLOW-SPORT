
/* ================================================================
   ARCHIVO: js/login.js
   ¿QUÉ HACE? Maneja el inicio de sesión.
   - Recoge correo y contraseña del formulario
   - Envía POST a /api/usuarios/login
   - Solo deja entrar a usuarios con rol "admin"
   - También maneja el modal de "olvidé contraseña"
   - Y el modal de registro de nuevo usuario
   ================================================================ */

   /* ================================================================
   SPORTFLOW ADMIN — LÓGICA DE LOGIN
   Archivo: js/login.js
   Descripción: Maneja el inicio de sesión, el modal de registro
   de nuevos usuarios y el modal de recuperación de contraseña.
   ================================================================ */
   
const API_BASE_URL = 'http://localhost:8080/api';

async function apiRequest(path, options = {}) {
  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });

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
      : `Error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function getUserName(user) {
  return user?.nombre || user?.name || user?.correo?.split('@')[0] || 'Admin';
}


document.addEventListener('DOMContentLoaded', () => {

  /* ── Referencias a los elementos del HTML ── */
  const loginBtn   = document.getElementById('loginBtn');
  const emailInput = document.getElementById('emailInput');
  const passInput  = document.getElementById('passInput');
  const errorMsg   = document.getElementById('errorMsg');


  /* ----------------------------------------------------------------
     INICIAR SESIÓN
     Verifica credenciales contra el backend
     ---------------------------------------------------------------- */
  async function tryLogin() {
    const correo = emailInput.value.trim();
    const contraseña = passInput.value;

    if (!correo || !contraseña) {
      errorMsg.style.display = 'block';
      passInput.focus();
      return;
    }

    try {
      const user = await apiRequest('/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña }),
      });

      // ── VERIFICACIÓN DE ROL ── 
      // Solo los administradores pueden acceder al sistema
    if (user.rol !== 'admin') {
        errorMsg.textContent = 'Acceso denegado. Solo los administradores pueden ingresar.';
        errorMsg.style.display = 'block';
        passInput.value = '';
        passInput.focus();
        return; // Para aquí, no deja entrar
      }
      // ── FIN VERIFICACIÓN DE ROL ──

      localStorage.setItem('sf_user', getUserName(user));
      window.location.href = '2_dashboard.html';


      localStorage.setItem('sf_user', getUserName(user));
      window.location.href = '2_dashboard.html';
    } catch (error) {
      errorMsg.style.display = 'block';
      passInput.value = '';
      passInput.focus();
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


    /* ----------------------------------------------------------------
      MODAL: REGISTRO DE NUEVO USUARIO
      Crea el usuario directamente en el backend.
      ---------------------------------------------------------------- */
  const registerLink  = document.getElementById('registerLink');
  const registerModal = document.getElementById('registerModal');
  const cancelReg     = document.getElementById('cancelRegister');
  const submitReg     = document.getElementById('submitRegister');

  const regName  = document.getElementById('regName');
  const regEmail = document.getElementById('regEmail');
  const regPass  = document.getElementById('regPass');
  const regError = document.getElementById('regError');

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

  /* Botón "Crear cuenta": valida y guarda el nuevo usuario */
  submitReg.addEventListener('click', async () => {
    const name  = regName.value.trim();
    const email = regEmail.value.trim();
    const pass  = regPass.value;

    /* Validaciones básicas */
    if (!name || !email.includes('@') || pass.length < 4) {
      regError.style.display = 'block';
      regError.textContent   = '⚠️ Completa todos los campos correctamente (contraseña mínimo 4 caracteres).';
      return;
    }

    try {
      await apiRequest('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: name,
          correo: email,
          edad: 18,
          rol: 'user',
          estado: true,
          contraseña: pass,
        }),
      });

      /* Cierra el modal y muestra un mensaje de éxito */
      closeRegisterModal();
      alert(`✅ Cuenta creada para ${name}. Ya puedes iniciar sesión.`);
    } catch (error) {
      regError.style.display = 'block';
      regError.textContent   = '⚠️ No fue posible crear la cuenta en el backend.';
    }
  });

});