# 📚 RESPUESTA A TU PREGUNTA: Recepción de Variables en el Backend

Profesor, aquí te explico EXACTAMENTE cómo funcionan las variables en el LOGIN y REGISTRO del sistema.

---

## 🎯 Tu Pregunta

> *"RECEPCION DE VARIABLES EN EL BACKEND, Y VARIABLES DEL LADO DEL FRONT PARA INICIAR SESION EL PROFESOR ESTA PREGUNTANDO TODO ESO AYUDAME POR FAVOR A ENTENDER Y QUE ME EXPLIQUES BIEN EL FLUJO Y EL ORDEN"*

---

## ✅ Respuesta Completa

He creado **documentación completa** con:

1. **EXPLICACION_FLUJO_LOGIN.md** - Guía completa paso a paso
2. **Comentarios detallados en el código** en:
   - `js/login.js` - Login y registro
   - `js/agregar-usuario.js` - Agregar usuarios desde admin
   - `js/utils.js` - Funciones compartidas con el backend

---

## 🔑 CONCEPTOS CLAVE

### ¿Qué son las VARIABLES?

Las variables son **espacios de memoria** que guardan información:

```
┌──────────────────────────────────────────────┐
│         FRONTEND (Navegador)                 │
├──────────────────────────────────────────────┤
│ Variables que el usuario VE y ESCRIBE       │
│ • correo: "profesor@sportflow.com"          │
│ • contraseña: "MiContraseña123"             │
└──────────────────────────────────────────────┘
              ⬇️ (Internet) ⬇️
┌──────────────────────────────────────────────┐
│         BACKEND (Servidor en puerto 8080)    │
├──────────────────────────────────────────────┤
│ Variables que el servidor RECIBE y PROCESA  │
│ • correo: "profesor@sportflow.com"          │
│ • contraseña: "MiContraseña123"             │
│ • rol: "admin" (del usuario en BD)          │
│ • id: 1 (generado por el backend)           │
└──────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE LOGIN - ORDEN EXACTO

### 1. **Usuario abre la página** (`index.html`)
```
VE: Un formulario con dos campos:
  - Campo de Email (id="emailInput")
  - Campo de Contraseña (id="passInput")
```

### 2. **Usuario escribe sus credenciales**
```javascript
// El navegador GUARDA en el input HTML:
emailInput.value = "profesor@sportflow.com"
passInput.value = "MiContraseña123"
```

### 3. **Usuario hace clic en "Iniciar Sesión"**
```
Se dispara el evento: click en loginBtn
Se ejecuta la función: tryLogin() (en js/login.js)
```

### 4. **JavaScript RECOGE los valores** (Línea 126-127 en login.js)
```javascript
const correo = emailInput.value.trim();      // "profesor@sportflow.com"
const contraseña = passInput.value;           // "MiContraseña123"
```

### 5. **JavaScript VALIDA** (Línea 129-133 en login.js)
```javascript
if (!correo || !contraseña) {
  mostrar_error("Completa los campos");
  return; // PARA AQUÍ, no envía al backend
}
```

### 6. **JavaScript CONVIERTE a JSON y ENVÍA** (Línea 136-140 en login.js)
```javascript
// ANTES (JavaScript):
{ correo: "profesor@sportflow.com", contraseña: "MiContraseña123" }

// DESPUÉS (JSON):
'{"correo":"profesor@sportflow.com","contraseña":"MiContraseña123"}'

// SE ENVÍA POR HTTP (POST):
POST http://localhost:8080/api/usuarios/login
```

### 7. **Backend RECIBE el JSON** (En Java/Spring Boot)
```
El servidor recibe en: POST /api/usuarios/login

Variables que recibe:
- correo = "profesor@sportflow.com"
- contraseña = "MiContraseña123"

El servidor:
1. Busca usuario con ese correo en la BD
2. Compara la contraseña (normalmente con hash)
3. Si es correcto: Devuelve el usuario
4. Si falla: Devuelve ERROR 401
```

### 8. **Backend DEVUELVE la respuesta** (JSON)
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

### 9. **JavaScript RECIBE la respuesta** (Línea 136 en login.js)
```javascript
const user = await apiRequest('/usuarios/login', {...});

// Ahora 'user' contiene:
{
  id: 1,
  nombre: "Profesor Juan",
  correo: "profesor@sportflow.com",
  edad: 35,
  rol: "admin",
  estado: true
}
```

### 10. **JavaScript VERIFICA el ROL** (Línea 144-149 en login.js)
```javascript
if (user.rol !== 'admin') {
  mostrar_error("Solo administradores pueden entrar");
  return; // BLOQUEA el acceso
}
// Si el usuario NO es admin, aquí termina el login
```

### 11. **JavaScript GUARDA en localStorage** (Línea 153 en login.js)
```javascript
localStorage.setItem('sf_user', getUserName(user));
// Guarda: Clave='sf_user', Valor='Profesor Juan'
// Propósito: Recordar quién inició sesión
```

### 12. **JavaScript REDIRIGE al dashboard** (Línea 155 en login.js)
```javascript
window.location.href = '2_dashboard.html';
// El usuario ve la página de administración
// ✅ LOGIN EXITOSO
```

---

## 📋 VARIABLES - RESUMEN VISUAL

### Frontend Variables (en el navegador)
| Variable | Valor Ejemplo | Dónde | Cuándo |
|----------|---------------|-------|--------|
| `emailInput.value` | "profesor@..." | HTML | Mientras escribe |
| `correo` | "profesor@..." | JavaScript | Al hacer clic en Login |
| `user` | {id:1, ...} | JavaScript | Después de respuesta del backend |

### Backend Variables (en el servidor)
| Variable | Valor Ejemplo | Recibida desde | Acción |
|----------|---------------|---|---|
| `correo` | "profesor@..." | Frontend (JSON) | Búsqueda en BD |
| `contraseña` | "MiContraseña123" | Frontend (JSON) | Verificación |
| `rol` | "admin" | Base de datos | Validación de permisos |
| `id` | 1 | Base de datos | Identificación |

---

## 🔐 FLUJO DE REGISTRO - ORDEN EXACTO

### Pasos (Similar al Login, pero CREAR usuario):

1. **Usuario abre modal "Regístrate aquí"**
2. **Escribe**: Nombre, Correo, Contraseña
3. **Hace clic**: "Crear cuenta"
4. **JavaScript recoge**:
   ```javascript
   const name = "Profesor Juan";
   const email = "profesor@sportflow.com";
   const pass = "MiContraseña123";
   ```

5. **JavaScript valida**:
   - ¿Nombre no vacío?
   - ¿Email tiene @?
   - ¿Contraseña >= 4 caracteres?

6. **JavaScript CONSTRUYE el objeto** (Línea 404-411 en login.js):
   ```javascript
   {
     nombre: "Profesor Juan",          // Lo que escribió
     correo: "profesor@sportflow.com",  // Lo que escribió
     edad: 18,                         // Valor por defecto
     rol: "user",                      // Valor por defecto (NO admin)
     estado: true,                     // Valor por defecto
     contraseña: "MiContraseña123"     // Lo que escribió
   }
   ```

7. **JavaScript ENVÍA** (POST a `/usuarios`):
   ```
   POST http://localhost:8080/api/usuarios
   ```

8. **Backend RECIBE y GUARDA**:
   - Valida que no exista ese correo
   - Genera ID automático
   - Guarda en base de datos

9. **Backend DEVUELVE**:
   ```json
   {
     "id": 15,
     "nombre": "Profesor Juan",
     "correo": "profesor@sportflow.com",
     "edad": 18,
     "rol": "user",
     "estado": true
   }
   ```

10. **Frontend muestra**: "✅ Cuenta creada para Profesor Juan"

---

## 🔗 ARCHIVOS DONDE VER TODO ESTO

### 1. **EXPLICACION_FLUJO_LOGIN.md** (Archivo nuevo)
   - Explicación completa paso a paso
   - Diagramas visuales
   - Tabla de variables
   - Ejemplos reales

### 2. **js/login.js** (Comentarios añadidos)
   - Línea 1-30: Explicación de variables principales
   - Línea 21-102: Función apiRequest() explicada
   - Línea 121-272: Función tryLogin() con 7 pasos explicados
   - Línea 348-480: Función de registro explicada

### 3. **js/agregar-usuario.js** (Comentarios añadidos)
   - Línea 1-47: Resumen del archivo
   - Línea 60-88: Validación de campos explicada
   - Línea 91-152: Recogida y envío de variables explicado

### 4. **js/utils.js** (Comentarios añadidos)
   - Línea 166-252: Función apiRequest() explicada en detalle
   - Línea 365-430: Función createUser() explicada
   - Línea 149-190: Función userToApiPayload() explicada

---

## 📊 DIAGRAMA GENERAL

```
┌─ USUARIO ─────────────────────────────────────────┐
│                                                    │
│  Abre: index.html                                 │
│  Ve formulario (email, contraseña)               │
│  Escribe valores                                  │
│  Hace clic: "Iniciar Sesión"                     │
│                                                    │
└─ JAVASCRIPT (Frontend) ──────────────────────────┐
│                                                    │
│  tryLogin() en js/login.js:                      │
│  1. Obtiene: correo, contraseña del HTML        │
│  2. Valida que no estén vacíos                  │
│  3. Crea JSON: {correo, contraseña}            │
│  4. Envía POST a backend                         │
│  5. Espera respuesta                             │
│                                                    │
└─ HTTP (Internet) ────────────────────────────────┐
│                                                    │
│  POST /api/usuarios/login                       │
│  Content-Type: application/json                  │
│  Body: {"correo":"...", "contraseña":"..."}    │
│                                                    │
└─ BACKEND (Java/Spring Boot) ──────────────────┐
│                                                    │
│  @PostMapping("/usuarios/login")                │
│  Recibe: correo, contraseña                     │
│  1. Busca usuario por correo en BD              │
│  2. Valida contraseña (con hash)               │
│  3. Obtiene: id, nombre, rol, etc. de BD      │
│  4. Devuelve JSON con usuario                  │
│                                                    │
└─ HTTP (Internet) ────────────────────────────────┐
│                                                    │
│  Response 200 OK                                 │
│  Body: {"id":1,"nombre":"...","rol":"admin"...} │
│                                                    │
└─ JAVASCRIPT (Frontend) ──────────────────────────┐
│                                                    │
│  2. Verifica: user.rol === 'admin'              │
│  3. Si NO es admin → ERROR BLOQUEADO            │
│  4. Si SÍ es admin:                             │
│     - Guarda en localStorage                     │
│     - Redirige a 2_dashboard.html               │
│                                                    │
└─ USUARIO (Dashboard) ─────────────────────────────┐
│                                                    │
│  ✅ LOGIN EXITOSO                                │
│  Ve navbar: "Hola, Profesor Juan"               │
│  Acceso a administración                        │
│                                                    │
```

---

## 🎓 CONCLUSIÓN

**El orden EXACTO es:**

1. 🔴 **Usuario escribe** en HTML input
2. 🟠 **JavaScript recoge** (correo, contraseña)
3. 🟡 **JavaScript valida** (no vacíos)
4. 🟢 **JavaScript convierte a JSON** y envía POST
5. 🔵 **Backend recibe** JSON en la solicitud
6. 🟣 **Backend busca** usuario en BD
7. ⚫ **Backend verifica** contraseña
8. 🟣 **Backend devuelve** JSON con usuario
9. 🔵 **Frontend recibe** respuesta
10. 🟢 **Frontend valida** rol (admin)
11. 🟡 **Frontend guarda** en localStorage
12. 🟠 **Frontend redirige** al dashboard
13. 🔴 **Usuario ve** dashboard ✅

---

## 💡 PUNTOS CLAVE PARA RECORDAR

✅ **Frontend ENVÍA**: correo + contraseña  
✅ **Backend RECIBE**: correo + contraseña (por POST)  
✅ **Backend DEVUELVE**: id + nombre + correo + rol + estado  
✅ **Frontend VERIFICA**: que rol sea "admin"  
✅ **Comunicación**: Por HTTP POST en formato JSON  

---

## 📖 ¿Dónde empezar a leer?

### Para principiantes:
1. Lee **EXPLICACION_FLUJO_LOGIN.md** (este archivo)
2. Luego lee los comentarios en **js/login.js**

### Para entender el código:
1. Abre **js/login.js** línea 136 (función tryLogin)
2. Lee los comentarios paso a paso
3. Busca la función **apiRequest** línea 21

### Para ver la práctica:
1. Abre navegador: http://localhost/PAGINA-WEB-FLOW-SPORT/
2. Abre DevTools (F12)
3. Ve a Network Tab
4. Intenta hacer login
5. Verás la solicitud POST y la respuesta JSON

---

**¡Espero haber explicado bien el flujo y las variables!**  
**Si tienes más preguntas, mira los comentarios en el código. ¡Todo está explicado!** 🎉
