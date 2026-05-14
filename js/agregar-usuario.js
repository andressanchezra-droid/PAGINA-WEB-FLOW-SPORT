/* ================================================================
   SPORTFLOW ADMIN — AGREGAR USUARIO
   Archivo: js/agregar-usuario.js
   Descripción: Valida y crea usuarios en el backend.
   ================================================================ */


document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    { id: 'userName', errId: 'errName', check: value => value.trim() !== '' },
    { id: 'userEmail', errId: 'errEmail', check: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
    { id: 'userAge', errId: 'errAge', check: value => value !== '' && Number(value) >= 0 },
    { id: 'userRole', errId: 'errRole', check: value => value !== '' },
    { id: 'userPass', errId: 'errPass', check: value => value.length >= 4 },
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

    const newUser = {
      nombre: document.getElementById('userName').value.trim(),
      correo: document.getElementById('userEmail').value.trim(),
      edad: parseInt(document.getElementById('userAge').value, 10),
      rol: document.getElementById('userRole').value,
      estado: document.getElementById('userState').value === 'true',
      contraseña: document.getElementById('userPass').value,
    };

    try {
      await createUser(newUser);
      showToast('Usuario guardado correctamente');
      setTimeout(() => window.location.href = '5_usuarios.html', 1200);
    } catch (error) {
      alert('No fue posible guardar el usuario en el backend.');
    }
  });
});
