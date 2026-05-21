/* =============================<===================================
   ARCHIVO: js/editar-usuario.js
   ¿QUÉ HACE? Formulario para EDITAR un usuario existente.
   - Lee el ID guardado en localStorage (puesto por usuarios.js)
   - Carga los datos actuales d>el usuario desde la API (GET /usuarios/{id})
   - Rellena el formulario con esos datos
   - Al guardar, hace PUT a /api/usuarios/{id}
   - El cambio queda en data/usuarios.json
   ================================================================ */

/* ================================================================
   SPORTFLOW ADMIN — EDITAR USUARIO
   Archivo: js/editar-usuario.js
   Descripción: Carga un usuario, permite modificarlo y guardar.
   ================================================================ */


document.addEventListener('DOMContentLoaded', async () => {
  const editId = localStorage.getItem('sf_user_edit_id');

  if (!editId) {
    showToast('No se encontró el usuario a editar');
    setTimeout(() => window.location.href = '5_usuarios.html', 1200);
    return;
  }

  let user = null;

  try {
    user = await getUserById(editId);
  } catch (error) {
    try {
      const users = await getUsers();
      user = users.find(item => String(item.id) === String(editId)) || null;
    } catch {
      user = null;
    }
  }

  if (!user) {
    showToast('No se encontró el usuario a editar');
    setTimeout(() => window.location.href = '5_usuarios.html', 1200);
    return;
  }

  document.getElementById('pageTitle').textContent = 'Editar Usuario: ' + (user.nombre || 'Usuario');

  const now = new Date();
  document.getElementById('pageDate').textContent =
    'Última actualización: ' +
    now.toLocaleDateString('es-CO') + ' ' +
    now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  document.getElementById('userName').value = user.nombre || '';
  document.getElementById('userEmail').value = user.correo || '';
  document.getElementById('userAge').value = Number(user.edad || 0);
  document.getElementById('userRole').value = user.rol || 'user';
  document.getElementById('userState').value = String(Boolean(user.estado));

  const fields = [
    { id: 'userName', errId: 'errName', check: value => value.trim() !== '' },
    { id: 'userEmail', errId: 'errEmail', check: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
    { id: 'userAge', errId: 'errAge', check: value => value !== '' && Number(value) >= 0 },
    { id: 'userRole', errId: 'errRole', check: value => value !== '' },
    { id: 'userPass', errId: 'errPass', check: value => value.trim() === '' || value.length >= 4 },
  ];

  function validate() {
    let allOk = true;

    fields.forEach(({ id, errId, check }) => {
      const input = document.getElementById(id);
      const error = document.getElementById(errId);

      if (!check(input.value.trim())) {
        error.style.display = 'block';
        allOk = false;
      } else {
        error.style.display = 'none';
      }
    });

    return allOk;
  }

  fields.forEach(({ id, errId }) => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(errId).style.display = 'none';
    });
  });

  document.getElementById('saveBtn').addEventListener('click', async () => {
    if (!validate()) return;

    const updatedUser = {
      nombre: document.getElementById('userName').value.trim(),
      correo: document.getElementById('userEmail').value.trim(),
      edad: parseInt(document.getElementById('userAge').value, 10),
      rol: document.getElementById('userRole').value,
      estado: document.getElementById('userState').value === 'true',
    };

    const password = document.getElementById('userPass').value.trim();
    if (password) {
      updatedUser.contraseña = password;
    }

    try {
      await updateUser(editId, updatedUser);
      showToast('Usuario actualizado correctamente');
      setTimeout(() => window.location.href = '5_usuarios.html', 1200);
    } catch (error) {
      alert('No fue posible actualizar el usuario en el backend.');
    }
  });
});
