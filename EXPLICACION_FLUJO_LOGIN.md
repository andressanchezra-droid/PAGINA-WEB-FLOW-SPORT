# 🔐 EXPLICACIÓN COMPLETA: Flujo de Login y Variables

## 📋 Tabla de Contenidos
1. [¿Qué son las Variables?](#qué-son-las-variables)
2. [Variables del Frontend (Lado del Cliente)](#variables-del-frontend)
3. [Variables del Backend (Lado del Servidor)](#variables-del-backend)
4. [Flujo Completo de Login](#flujo-completo-de-login)
5. [Flujo Completo de Registro](#flujo-completo-de-registro)
6. [Diagrama Visual del Proceso](#diagrama-visual-del-proceso)

---

## ¿Qué son las Variables?

Las **variables** son espacios de memoria que guardan información (datos).

- **Frontend**: Variables que están en la pantalla del usuario (navegador)
- **Backend**: Variables que están en el servidor (computadora en localhost:8080)

---

## Variables del Frontend

### 📱 En `index.html` - Formulario de Login

```html
<!-- Estos son los campos HTML donde el usuario escribe -->
<input type="email" id="emailInput" placeholder="usuario@sportflow.com">
<input type="password" id="passInput" placeholder="Contraseña">
```

### 💻 En `js/login.js` - Las variables JavaScript

```javascript
// Línea 58-61: Se obtienen REFERENCIAS a los elementos HTML
const loginBtn   = document.getElementById('loginBtn');     // Botón "Iniciar Sesión"
const emailInput = document.getElementById('emailInput');   // Campo de correo
const passInput  = document.getElementById('passInput');    // Campo de contraseña
const errorMsg   = document.getElementById('errorMsg');     // Mensaje de error

// En la función tryLogin() - Línea 69-70: Se OBTIENEN los VALORES
const correo = emailInput.value.trim();        // Aquí se guarda lo que escribió el usuario en el email
const contraseña = passInput.value;            // Aquí se guarda lo que escribió el usuario en la contraseña
```

**Ejemplo**: Si el usuario escribe:
```
Email:    profesor@sportflow.com
Contraseña: MiContraseña123
```

Entonces las variables quedan así:
```javascript
correo = "profesor@sportflow.com"
contraseña = "MiContraseña123"
```

---

## Variables del Backend

### 🖥️ Lo que el Backend ESPERA recibir

El backend escucha en: `http://localhost:8080/api/usuarios/login`

Espera recibir un **JSON** con estas variables:
```json
{
  "correo": "profesor@sportflow.com",
  "contraseña": "MiContraseña123"
}
```

### 🖥️ Lo que el Backend DEVUELVE (Respuesta)

Si las credenciales son correctas, devuelve un objeto usuario con:
```json
{
  "id": 1,
  "nombre": "Profesor Juan",
  "correo": "profesor@sportflow.com",
  "edad": 35,
  "rol": "admin",
  "estado": true
}
```

**Importante**: El backend verifica que `rol === "admin"` para dejar entrar.

---

## Flujo Completo de Login

### ⏱️ PASO A PASO - ¿QUÉ SUCEDE CUANDO ALGUIEN INICIA SESIÓN?

```
┌─────────────────────────────────────────────────────────────────┐
│ PASO 1: Usuario escribe en el formulario HTML                   │
├─────────────────────────────────────────────────────────────────┤
│ • El usuario abre: index.html                                   │
│ • Ve dos campos: Correo y Contraseña                           │
│ • Escribe: profesor@sportflow.com y MiContraseña123           │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 2: El usuario hace clic en "Iniciar Sesión"               │
├─────────────────────────────────────────────────────────────────┤
│ • Se dispara el evento: click en loginBtn                       │
│ • Se ejecuta la función: tryLogin() (línea 68 en login.js)     │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 3: JavaScript recoge los valores del formulario            │
├─────────────────────────────────────────────────────────────────┤
│ const correo = emailInput.value.trim();                         │
│ const contraseña = passInput.value;                             │
│                                                                  │
│ Ahora tenemos:                                                   │
│ • correo = "profesor@sportflow.com"                            │
│ • contraseña = "MiContraseña123"                               │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 4: JavaScript VALIDA que no estén vacíos (línea 72-76)    │
├─────────────────────────────────────────────────────────────────┤
│ if (!correo || !contraseña) {                                   │
│   // Mostrar error: "Completa los campos"                       │
│   return; // No continúa                                        │
│ }                                                                │
│                                                                  │
│ Si pasa esta validación, continúa...                            │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 5: JavaScript CONVIERTE a JSON y ENVÍA al Backend         │
├─────────────────────────────────────────────────────────────────┤
│ JSON.stringify({ correo, contraseña })                         │
│                                                                  │
│ Se envía:                                                        │
│ {                                                                │
│   "correo": "profesor@sportflow.com",                          │
│   "contraseña": "MiContraseña123"                              │
│ }                                                                │
│                                                                  │
│ Método: POST                                                     │
│ URL: http://localhost:8080/api/usuarios/login                  │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
                       (Internet)
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 6: BACKEND RECIBE el JSON (En Java/Spring Boot)          │
├─────────────────────────────────────────────────────────────────┤
│ El backend (localhost:8080) recibe POST en /api/usuarios/login │
│                                                                  │
│ Variables que recibe:                                            │
│ • correo = "profesor@sportflow.com"                            │
│ • contraseña = "MiContraseña123"                               │
│                                                                  │
│ En Java sería algo como:                                        │
│ public ResponseEntity login(@RequestBody LoginRequest req) {    │
│   String correo = req.getCorreo();        // profesor@...      │
│   String contraseña = req.getContraseña(); // MiContraseña123 │
│   ...                                                            │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 7: Backend BUSCA el usuario en la base de datos           │
├─────────────────────────────────────────────────────────────────┤
│ • Busca: ¿Existe usuario con correo = "profesor@sportflow.com"?│
│ • Si EXISTE: Compara contraseña guardada con la recibida       │
│ • Si la contraseña COINCIDE: Devuelve el usuario               │
│ • Si FALLA: Devuelve error 401 (Unauthorized)                  │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 8: Backend DEVUELVE la respuesta (JSON)                   │
├─────────────────────────────────────────────────────────────────┤
│ Si el usuario existe y contraseña es correcta, devuelve:        │
│ {                                                                │
│   "id": 1,                                                       │
│   "nombre": "Profesor Juan",                                     │
│   "correo": "profesor@sportflow.com",                          │
│   "edad": 35,                                                    │
│   "rol": "admin",                                               │
│   "estado": true                                                │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
                       (Internet)
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 9: JavaScript RECIBE la respuesta (línea 79-83)           │
├─────────────────────────────────────────────────────────────────┤
│ const user = await apiRequest('/usuarios/login', {...})        │
│                                                                  │
│ Ahora 'user' contiene:                                           │
│ {                                                                │
│   id: 1,                                                         │
│   nombre: "Profesor Juan",                                       │
│   correo: "profesor@sportflow.com",                            │
│   ...                                                            │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 10: JavaScript VERIFICA el ROL (línea 87-93)              │
├─────────────────────────────────────────────────────────────────┤
│ if (user.rol !== 'admin') {                                     │
│   // Mostrar error: "Solo administradores pueden entrar"       │
│   // Bloquea el acceso                                          │
│   return;                                                        │
│ }                                                                │
│                                                                  │
│ Nota: Solo usuarios con rol="admin" pueden acceder             │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 11: Si todo está bien, GUARDA datos en localStorage      │
├─────────────────────────────────────────────────────────────────┤
│ localStorage.setItem('sf_user', getUserName(user));            │
│                                                                  │
│ Se guarda:                                                       │
│ • Clave: "sf_user"                                              │
│ • Valor: "Profesor Juan" (o "profesor@" si no tiene nombre)   │
│                                                                  │
│ Esto es para recordar quién inició sesión la próxima vez       │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 12: Redirige a la página de dashboard                     │
├─────────────────────────────────────────────────────────────────┤
│ window.location.href = '2_dashboard.html';                      │
│                                                                  │
│ ✅ El usuario ha iniciado sesión exitosamente                  │
│ ✅ Ahora ve el dashboard                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flujo Completo de Registro

Cuando alguien se registra, el flujo es similar pero más simple:

```
┌─────────────────────────────────────────────────────────────────┐
│ PASO 1: Usuario abre el modal "Regístrate aquí"                │
├─────────────────────────────────────────────────────────────────┤
│ • Llena: Nombre, Correo, Contraseña                           │
│ • Hace clic: "Crear cuenta"                                    │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 2: JavaScript recoge los valores (línea 220-222)          │
├─────────────────────────────────────────────────────────────────┤
│ const name  = regName.value.trim();                             │
│ const email = regEmail.value.trim();                            │
│ const pass  = regPass.value;                                    │
│                                                                  │
│ name  = "Profesor Juan"                                         │
│ email = "profesor@sportflow.com"                               │
│ pass  = "MiContraseña123"                                      │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 3: JavaScript VALIDA (línea 225)                          │
├─────────────────────────────────────────────────────────────────┤
│ Comprueba:                                                       │
│ • ¿El nombre no está vacío?                                    │
│ • ¿El correo tiene @?                                          │
│ • ¿La contraseña tiene al menos 4 caracteres?                 │
│                                                                  │
│ Si todo está bien, continúa...                                  │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 4: JavaScript CONSTRUYE el objeto usuario (línea 235-242) │
├─────────────────────────────────────────────────────────────────┤
│ {                                                                │
│   nombre: "Profesor Juan",      // Lo que escribió             │
│   correo: "profesor@sportflow.com", // Lo que escribió         │
│   edad: 18,                    // Valor por defecto             │
│   rol: "user",                 // Valor por defecto            │
│   estado: true,                // Valor por defecto             │
│   contraseña: "MiContraseña123" // Lo que escribió             │
│ }                                                                │
│                                                                  │
│ Nota: "rol" y "edad" son fijos porque es nuevo usuario        │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 5: Envía POST al backend con los datos                    │
├─────────────────────────────────────────────────────────────────┤
│ URL: http://localhost:8080/api/usuarios (POST)                │
│                                                                  │
│ JSON que envía:                                                  │
│ {                                                                │
│   "nombre": "Profesor Juan",                                    │
│   "correo": "profesor@sportflow.com",                          │
│   "edad": 18,                                                   │
│   "rol": "user",                                                │
│   "estado": true,                                               │
│   "contraseña": "MiContraseña123"                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
                       (Internet)
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 6: Backend recibe y GUARDA el usuario                     │
├─────────────────────────────────────────────────────────────────┤
│ • Backend valida que no exista otro con el mismo correo        │
│ • Genera un ID automático                                      │
│ • Guarda en la base de datos (o archivo JSON)                 │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 7: Backend devuelve el usuario creado                     │
├─────────────────────────────────────────────────────────────────┤
│ {                                                                │
│   "id": 15,                    // Generado por el backend      │
│   "nombre": "Profesor Juan",                                    │
│   "correo": "profesor@sportflow.com",                          │
│   "edad": 18,                                                   │
│   "rol": "user",                                                │
│   "estado": true                                                │
│ }                                                                │
│                                                                  │
│ Nota: La contraseña NO se devuelve por seguridad              │
└─────────────────────────────────────────────────────────────────┘
                            ⬇️
                       (Internet)
                            ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ PASO 8: JavaScript muestra mensaje de éxito                    │
├─────────────────────────────────────────────────────────────────┤
│ alert(`✅ Cuenta creada para ${name}. Ya puedes iniciar sesión.`);
│                                                                  │
│ ✅ Usuario registrado correctamente                            │
│ ✅ Ahora puede iniciar sesión con su correo y contraseña      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagrama Visual del Proceso

### 📊 Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                       NAVEGADOR DEL USUARIO                     │
│                   (Frontend - Client-side)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ HTML: index.html                                         │  │
│  │ ├─ Campo: emailInput    (input email)                   │  │
│  │ └─ Campo: passInput     (input password)                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ⬇️                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ JavaScript: js/login.js                                  │  │
│  │ ├─ Recoge valores: correo, contraseña                  │  │
│  │ ├─ Valida que no estén vacíos                          │  │
│  │ ├─ Convierte a JSON                                     │  │
│  │ └─ Envía por HTTP (fetch)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ⬇️                                    │
│             JSON: { correo, contraseña }                        │
│                 POST Request (HTTP)                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
         ⬇️ ⬇️ ⬇️ (A través de INTERNET) ⬇️ ⬇️ ⬇️
┌─────────────────────────────────────────────────────────────────┐
│              SERVIDOR: localhost:8080 (Backend)                 │
│           (Server-side - Java/Spring Boot)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ @PostMapping("/api/usuarios/login")                      │  │
│  │ public ResponseEntity login(@RequestBody LoginRequest) { │  │
│  │                                                           │  │
│  │   String correo = request.getCorreo();                  │  │
│  │   String contraseña = request.getContraseña();          │  │
│  │                                                           │  │
│  │   // 1. BUSCA usuario con ese correo                    │  │
│  │   // 2. VERIFICA que contraseña coincida                │  │
│  │   // 3. Si TODO BIEN: Devuelve el usuario               │  │
│  │   // 4. Si FALLA: Devuelve error 401                    │  │
│  │                                                           │  │
│  │   return ResponseEntity.ok(usuario); // ✅ Éxito        │  │
│  │ }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ⬇️                                    │
│   JSON: { id, nombre, correo, edad, rol, estado }             │
│               POST Response (HTTP 200)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
         ⬇️ ⬇️ ⬇️ (A través de INTERNET) ⬇️ ⬇️ ⬇️
┌─────────────────────────────────────────────────────────────────┐
│                       NAVEGADOR DEL USUARIO                     │
│                   (Frontend - Client-side)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ JavaScript: Recibe la respuesta                         │  │
│  │                                                           │  │
│  │ const user = await apiRequest('/usuarios/login', ...);  │  │
│  │                                                           │  │
│  │ // Verifica rol                                          │  │
│  │ if (user.rol !== 'admin') {                             │  │
│  │   mostrar_error(); // Solo admin puede entrar           │  │
│  │   return;                                                │  │
│  │ }                                                         │  │
│  │                                                           │  │
│  │ // Guarda en localStorage                               │  │
│  │ localStorage.setItem('sf_user', user.nombre);           │  │
│  │                                                           │  │
│  │ // Redirige al dashboard                                │  │
│  │ window.location.href = '2_dashboard.html';              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ⬇️                                    │
│              ✅ Usuario en el Dashboard                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Variables Clave - RESUMEN

### Frontend Variables (en `js/login.js`)

| Variable | Dónde se obtiene | Valor Ejemplo | Tipo |
|----------|-----------------|---------------|------|
| `correo` | `emailInput.value` | "profesor@sportflow.com" | string |
| `contraseña` | `passInput.value` | "MiContraseña123" | string |
| `user` | Respuesta del backend | `{id:1, nombre:"...", ...}` | object |

### Backend Variables (recibe POST)

| Variable | Recibida desde | Valor Ejemplo | Tipo |
|----------|----------------|---------------|------|
| `correo` | JSON del Frontend | "profesor@sportflow.com" | string |
| `contraseña` | JSON del Frontend | "MiContraseña123" | string |
| `rol` | Base de datos | "admin" o "user" | string |
| `id` | Base de datos (generado) | 1 | long |

---

## ✅ Checklist de Comprensión

- [ ] Entiendo que las variables del Frontend están en el navegador
- [ ] Entiendo que las variables del Backend están en el servidor
- [ ] Entiendo que se comunican a través de JSON y HTTP
- [ ] Entiendo que el Frontend ENVÍA: correo + contraseña
- [ ] Entiendo que el Backend RECIBE: correo + contraseña
- [ ] Entiendo que el Backend BUSCA el usuario en la base de datos
- [ ] Entiendo que el Backend VERIFICA la contraseña
- [ ] Entiendo que el Backend DEVUELVE el usuario con su rol
- [ ] Entiendo que el Frontend VERIFICA que rol sea "admin"
- [ ] Entiendo que el Frontend GUARDA el nombre en localStorage
- [ ] Entiendo que el Frontend REDIRIGE al dashboard

---

## 🔍 Dónde ver estas variables en el código

### Frontend - `index.html`
```html
<!-- Línea ~50: Campos del formulario -->
<input type="email" id="emailInput" placeholder="usuario@sportflow.com">
<input type="password" id="passInput" placeholder="Contraseña">
```

### Frontend - `js/login.js`
```javascript
// Línea 58-61: Referencias a los elementos
const emailInput = document.getElementById('emailInput');
const passInput = document.getElementById('passInput');

// Línea 69-70: Obtención de valores
const correo = emailInput.value.trim();
const contraseña = passInput.value;

// Línea 82: Envío a backend
body: JSON.stringify({ correo, contraseña })

// Línea 87: Verificación del rol
if (user.rol !== 'admin') {
```

### Backend - Java (Pseudocódigo)
```java
// El backend recibe en: POST /api/usuarios/login
// Variables que recibe:
// - String correo (ej: "profesor@sportflow.com")
// - String contraseña (ej: "MiContraseña123")

// El backend devuelve:
// - id: Long (ej: 1)
// - nombre: String (ej: "Profesor Juan")
// - correo: String (ej: "profesor@sportflow.com")
// - edad: Integer (ej: 35)
// - rol: String (ej: "admin")
// - estado: Boolean (ej: true)
```

---

## 🎓 Conclusión

El flujo de login es así:

1. **Usuario escribe** en el formulario HTML
2. **JavaScript recoge** esos valores
3. **JavaScript valida** que no estén vacíos
4. **JavaScript envía** por HTTP (POST) al backend
5. **Backend recibe** el JSON con correo y contraseña
6. **Backend busca** el usuario en la base de datos
7. **Backend verifica** que la contraseña sea correcta
8. **Backend devuelve** el usuario con su información
9. **JavaScript recibe** la respuesta del backend
10. **JavaScript verifica** que el rol sea "admin"
11. **JavaScript guarda** el nombre en localStorage
12. **JavaScript redirige** al dashboard

¡Así es como funciona el sistema de login! 🎉

