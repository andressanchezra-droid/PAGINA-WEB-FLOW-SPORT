/* ================================================================
   SPORTFLOW ADMIN — LÓGICA DE LOGIN
   Archivo: js/login.js
   Descripción: Maneja el inicio de sesión, el modal de registro
   de nuevos usuarios y el modal de recuperación de contraseña.
   ================================================================ */


/* ----------------------------------------------------------------
   USUARIOS VÁLIDOS DEL SISTEMA
   Aquí se definen los 3 usuarios con su correo, contraseña y nombre.
   En un sistema real esto estaría en un servidor, no aquí.
   ---------------------------------------------------------------- */
const USERS = [
  { email: 'sanchezandresfelipe191@gmail.com',  password: 'Admin123!',  name: 'Admin'  },
  { email: 'carlos@sportflow.com', password: 'Carlos456!', name: 'Carlos' },
  { email: 'maria@sportflow.com',  password: 'Maria789!',  name: 'María'  },
];


document.addEventListener('DOMContentLoaded', () => {

  /* ── Referencias a los elementos del HTML ── */
  const loginBtn   = document.getElementById('loginBtn');
  const emailInput = document.getElementById('emailInput');
  const passInput  = document.getElementById('passInput');
  const errorMsg   = document.getElementById('errorMsg');


  /* ----------------------------------------------------------------
     INICIAR SESIÓN
     Verifica que el correo y contraseña coincidan con un usuario
     ---------------------------------------------------------------- */
  function tryLogin() {
    const email = emailInput.value.trim();
    const pass  = passInput.value;

    /* Busca el usuario que tenga ese correo Y esa contraseña */
    const user = USERS.find(u => u.email === email && u.password === pass);

    if (user) {
      /* Usuario encontrado: guarda el nombre y redirige al dashboard */
      localStorage.setItem('sf_user', user.name);
      window.location.href = '2_dashboard.html';
    } else {
      /* Usuario no encontrado: muestra error y borra la contraseña */
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
     Permite crear una cuenta con nombre, correo y contraseña.
     Los nuevos usuarios se guardan en localStorage.
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
  submitReg.addEventListener('click', () => {
    const name  = regName.value.trim();
    const email = regEmail.value.trim();
    const pass  = regPass.value;

    /* Validaciones básicas */
    if (!name || !email.includes('@') || pass.length < 4) {
      regError.style.display = 'block';
      regError.textContent   = '⚠️ Completa todos los campos correctamente (contraseña mínimo 4 caracteres).';
      return;
    }

    /* Lee los usuarios existentes guardados (o empieza con la lista base) */
    const savedUsers = JSON.parse(localStorage.getItem('sf_extra_users') || '[]');

    /* Verifica que el correo no esté ya registrado */
    const allEmails = [...USERS.map(u => u.email), ...savedUsers.map(u => u.email)];
    if (allEmails.includes(email)) {
      regError.style.display = 'block';
      regError.textContent   = '⚠️ Ese correo ya está registrado.';
      return;
    }

    /* Guarda el nuevo usuario en localStorage */
    savedUsers.push({ email, password: pass, name });
    localStorage.setItem('sf_extra_users', JSON.stringify(savedUsers));

    /* Cierra el modal y muestra un mensaje de éxito */
    closeRegisterModal();
    alert(`✅ Cuenta creada para ${name}. Ya puedes iniciar sesión.`);
  });

});


/* ----------------------------------------------------------------
   INICIAR SESIÓN CON USUARIOS REGISTRADOS DINÁMICAMENTE
   Sobreescribe la función tryLogin para incluir usuarios de localStorage
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* Al intentar login, también revisa los usuarios registrados dinámicamente */
  const loginBtn   = document.getElementById('loginBtn');
  const emailInput = document.getElementById('emailInput');
  const passInput  = document.getElementById('passInput');
  const errorMsg   = document.getElementById('errorMsg');

  /* Reemplaza el listener anterior con uno que incluya usuarios extra */
  loginBtn.replaceWith(loginBtn.cloneNode(true)); /* Limpia listeners previos */
  const newLoginBtn = document.getElementById('loginBtn');

  function tryLoginFull() {
    const email = emailInput.value.trim();
    const pass  = passInput.value;

    /* Combina usuarios fijos con los registrados dinámicamente */
    const extraUsers = JSON.parse(localStorage.getItem('sf_extra_users') || '[]');
    const allUsers   = [...USERS, ...extraUsers];

    const user = allUsers.find(u => u.email === email && u.password === pass);

    if (user) {
      localStorage.setItem('sf_user', user.name);
      window.location.href = '2_dashboard.html';
    } else {
      errorMsg.style.display = 'block';
      passInput.value = '';
      passInput.focus();
    }
  }

  newLoginBtn.addEventListener('click', tryLoginFull);
  passInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryLoginFull(); });
  [emailInput, passInput].forEach(el => {
    el.addEventListener('input', () => errorMsg.style.display = 'none');
  });

});