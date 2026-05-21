/* ================================================================
   ARCHIVO: js/agregar-usuario.js
   
   ¿QUÉ HACE? 
   - Formulario para CREAR un nuevo usuario (página 6_agregar_usuario.html)
   - RECOGE variables: nombre, correo, edad, rol, contraseña del formulario
   - VALIDA que los campos sean correctos
   - ENVÍA al backend (POST /api/usuarios)
   
   FLUJO:
   1. Admin rellena el formulario en 6_agregar_usuario.html
   2. Admin hace clic en "Guardar"
   3. JavaScript recoge los valores (VARIABLES FRONTEND)
   4. JavaScript valida cada campo
   5. JavaScript llama a createUser() (que está en utils.js)
   6. createUser() hace POST al backend
   7. Backend recibe las variables y guarda en data/usuarios.json
   8. Backend devuelve el usuario creado (con ID generado)
   9. Frontend guarda en caché (localStorage)
   10. Frontend redirige a la lista de usuarios
   
   VARIABLES QUE RECIBE DEL FORMULARIO:
   - nombre: string (ej: "Juan Perez")
   - correo: string (ej: "juan@example.com")
   - edad: number (ej: 25)
   - rol: string (ej: "admin", "user", "profesor")
   - estado: boolean (ej: true = activo, false = inactivo)
   - contraseña: string (ej: "123456")
   
   VARIABLES QUE ENVÍA AL BACKEND:
   Se envían en el BODY del POST como JSON:
   {
     "nombre": "Juan Perez",
     "correo": "juan@example.com",
     "edad": 25,
     "rol": "admin",
     "estado": true,
     "contraseña": "123456"
   }
   
   LO QUE EL BACKEND DEVUELVE:
   {
     "id": 5,
     "nombre": "Juan Perez",
     "correo": "juan@example.com",
     "edad": 25,
     "rol": "admin",
     "estado": true
   }
   Nota: NO devuelve la contraseña por seguridad
   ================================================================ */

/* ================================================================
   SPORTFLOW ADMIN — AGREGAR USUARIO
   Archivo: js/agregar-usuario.js
   Descripción: Valida y crea usuarios en el backend.
   ================================================================ */


document.addEventListener('DOMContentLoaded', () => {
  /* ──────────────────────────────────────────────────────────────
     PASO 1: DEFINIR LOS CAMPOS DEL FORMULARIO QUE DEBEN VALIDARSE
     ────────────────────────────────────────────────────────────── */
  const fields = [
    { id: 'userName',  errId: 'errName',  check: value => value.trim() !== '' },
    // ↑ Campo: Nombre - debe no estar vacío
    
    { id: 'userEmail', errId: 'errEmail', check: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
    // ↑ Campo: Email - debe contener @ y un dominio válido (ej: user@example.com)
    // ↑ /^[^\s@]+@[^\s@]+\.[^\s@]+$/ es una expresión regular (regex) que valida email
    
    { id: 'userAge',   errId: 'errAge',   check: value => value !== '' && Number(value) >= 0 },
    // ↑ Campo: Edad - debe tener un valor y ser >= 0
    
    { id: 'userRole',  errId: 'errRole',  check: value => value !== '' },
    // ↑ Campo: Rol - debe seleccionar un rol (admin, user, profesor)
    
    { id: 'userPass',  errId: 'errPass',  check: value => value.length >= 4 },
    // ↑ Campo: Contraseña - debe tener al menos 4 caracteres
  ];

  /* ──────────────────────────────────────────────────────────────
     PASO 2: FUNCIÓN PARA VALIDAR TODOS LOS CAMPOS
     ────────────────────────────────────────────────────────────── */
  function validate() {
    // Esta función recorre TODOS los campos y verifica si son válidos
    let allOk = true;
    // ↑ Asume que todo está bien (hasta que encuentre un error)

    fields.forEach(({ id, errId, check }) => {
      // ↑ Para CADA campo del array 'fields':
      
      const input = document.getElementById(id);
      // ↑ Obtiene el elemento HTML (el input)
      
      const error = document.getElementById(errId);
      // ↑ Obtiene el elemento HTML del mensaje de error

      if (!check(input.value.trim())) {
        // ↑ Si la función check() devuelve FALSE (validación fallida)
        
        error.style.display = 'block';
        // ↑ Muestra el mensaje de error en rojo
        
        allOk = false;
        // ↑ Marca que hay al menos un error
        
      } else {
        // ↑ Si la validación PASÓ (check() devolvió TRUE)
        
        error.style.display = 'none';
        // ↑ Oculta el mensaje de error
      }
    });

    return allOk;
    // ↑ Devuelve TRUE si TODO está bien, FALSE si hay errores
  }

  /* ──────────────────────────────────────────────────────────────
     PASO 3: LIMPIAR MENSAJES DE ERROR MIENTRAS ESCRIBE
     ────────────────────────────────────────────────────────────── */
  fields.forEach(({ id, errId }) => {
    document.getElementById(id).addEventListener('input', () => {
      // ↑ Cada vez que el usuario ESCRIBE en un campo:
      
      document.getElementById(errId).style.display = 'none';
      // ↑ Oculta el mensaje de error (para que no sea molesto)
    });
  });

  /* ──────────────────────────────────────────────────────────────
     PASO 4: BOTÓN "GUARDAR" - RECIBE VARIABLES Y ENVÍA AL BACKEND
     ────────────────────────────────────────────────────────────── */
  document.getElementById('saveBtn').addEventListener('click', async () => {
    // ↑ Cuando el usuario hace clic en el botón "Guardar":
    
    if (!validate()) return;
    // ↑ Primero valida que todos los campos sean correctos
    // ↑ Si hay errores, return (para aquí y no continúa)

    /* ═══════════════════════════════════════════════════════════════
       RECOGIDA DE VARIABLES DEL FORMULARIO
       ═══════════════════════════════════════════════════════════════
    */
    const newUser = {
      nombre: document.getElementById('userName').value.trim(),
      // ↑ VARIABLE 1: Obtiene el nombre (ej: "Juan Perez")
      
      correo: document.getElementById('userEmail').value.trim(),
      // ↑ VARIABLE 2: Obtiene el correo (ej: "juan@example.com")
      
      edad: parseInt(document.getElementById('userAge').value, 10),
      // ↑ VARIABLE 3: Obtiene la edad y la convierte a número
      // ↑ parseInt(..., 10) = "25" (string) → 25 (número)
      
      rol: document.getElementById('userRole').value,
      // ↑ VARIABLE 4: Obtiene el rol seleccionado (ej: "admin")
      
      estado: document.getElementById('userState').value === 'true',
      // ↑ VARIABLE 5: Obtiene el estado y lo convierte a boolean
      // ↑ "true" (string) → true (boolean)
      
      contraseña: document.getElementById('userPass').value,
      // ↑ VARIABLE 6: Obtiene la contraseña
    };

    // Ahora 'newUser' es un objeto con TODAS las variables
    // Ejemplo:
    // {
    //   nombre: "Juan Perez",
    //   correo: "juan@example.com",
    //   edad: 25,
    //   rol: "admin",
    //   estado: true,
    //   contraseña: "123456"
    // }

    try {
      /* ═════════════════════════════════════════════════════════════════
         ENVIAR AL BACKEND
         ═════════════════════════════════════════════════════════════════
      */
      await createUser(newUser);
      // ↑ Llama a createUser() que está en utils.js
      // ↑ createUser() hace POST a http://localhost:8080/api/usuarios
      // ↑ Envía el objeto newUser como JSON en el body
      
      // El backend recibe:
      // POST /api/usuarios
      // {
      //   "nombre": "Juan Perez",
      //   "correo": "juan@example.com",
      //   "edad": 25,
      //   "rol": "admin",
      //   "estado": true,
      //   "contraseña": "123456"
      // }

      /* ═════════════════════════════════════════════════════════════════
         ÉXITO
         ═════════════════════════════════════════════════════════════════
      */
      showToast('Usuario guardado correctamente');
      // ↑ Muestra notificación flotante de éxito
      
      setTimeout(() => window.location.href = '5_usuarios.html', 1200);
      // ↑ Después de 1.2 segundos, redirige a la lista de usuarios
      // ↑ El usuario ve que fue guardado y vuelve a la lista
      
    } catch (error) {
      /* ═════════════════════════════════════════════════════════════════
         ERROR
         ═════════════════════════════════════════════════════════════════
      */
      // Si el backend devuelve error:
      // - Email ya existe
      // - Error de base de datos
      // - Error de servidor
      // - etc.
      
      alert('No fue posible guardar el usuario en el backend.');
    }
  });
});
