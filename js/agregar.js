/* ================================================================
   SPORTFLOW ADMIN — AGREGAR NUEVO PRODUCTO
   Archivo: js/agregar.js
   Descripción: Maneja el formulario de registro de un nuevo producto:
   carga de imagen, validación de campos y guardado en localStorage.
   ================================================================ */


document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------
     CARGA DE IMAGEN
     Permite subir imagen haciendo clic en el cuadro o arrastrando el archivo
     ---------------------------------------------------------------- */
  const uploadArea = document.getElementById('uploadArea'); /* Cuadro punteado */
  const fileInput  = document.getElementById('fileInput');  /* Input oculto de tipo file */
  const imgPreview = document.getElementById('imgPreview'); /* Div que muestra la preview */
  const previewImg = document.getElementById('previewImg'); /* La etiqueta <img> de preview */
  let imgData = ''; /* Almacena la imagen en base64 (texto) para guardar */

  /* Clic en el cuadro punteado abre el explorador de archivos */
  uploadArea.addEventListener('click', () => fileInput.click());

  /* Efecto visual al arrastrar un archivo sobre el cuadro */
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag'); /* Aplica fondo azul claro */
  });

  /* Quita el efecto cuando el archivo sale del cuadro */
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag');
  });

  /* Cuando se suelta un archivo sobre el cuadro */
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag');
    const file = e.dataTransfer.files[0]; /* Solo toma el primer archivo */
    if (file) handleFile(file);
  });

  /* Cuando se selecciona un archivo con el input */
  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });

  /* Procesa el archivo de imagen seleccionado:
     - Valida que sea imagen
     - Lo convierte a base64
     - Muestra la preview */
  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes (PNG, JPG, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      imgData = ev.target.result;       /* Guarda el base64 */
      previewImg.src = imgData;         /* Lo muestra en el <img> */
      imgPreview.style.display = 'block'; /* Muestra la preview */
      uploadArea.style.display = 'none';  /* Oculta el cuadro de carga */
    };
    reader.readAsDataURL(file); /* Convierte el archivo a base64 */
  }

  /* Botón rojo "✕" sobre la imagen: la elimina y vuelve al cuadro de carga */
  document.getElementById('removeImg').addEventListener('click', () => {
    imgData = '';
    previewImg.src = '';
    imgPreview.style.display = 'none';
    uploadArea.style.display = 'block';
    fileInput.value = ''; /* Limpia el input para poder subir otra vez */
  });


  /* ----------------------------------------------------------------
     VALIDACIÓN DE CAMPOS
     Lista de campos obligatorios con su función de validación
     ---------------------------------------------------------------- */
  const validations = [
    { id: 'prodName',  errId: 'errName',  check: v => v.trim() !== '' },
    { id: 'prodDesc',  errId: 'errDesc',  check: v => v.trim() !== '' },
    { id: 'prodCat',   errId: 'errCat',   check: v => v !== '' },
    { id: 'prodStock', errId: 'errStock', check: v => v !== '' && Number(v) >= 0 },
    { id: 'prodBuy',   errId: 'errBuy',   check: v => v !== '' && Number(v) >= 0 },
    { id: 'prodSell',  errId: 'errSell',  check: v => v !== '' && Number(v) >= 0 },
  ];

  /* Recorre todos los campos y muestra los errores de los inválidos */
  function validate() {
    let allOk = true;
    validations.forEach(({ id, errId, check }) => {
      const val = document.getElementById(id).value;
      const err = document.getElementById(errId);
      if (!check(val)) {
        err.style.display = 'block'; /* Muestra el mensaje de error */
        allOk = false;
      } else {
        err.style.display = 'none';  /* Oculta el mensaje de error */
      }
    });
    return allOk;
  }

  /* Oculta el error de un campo al empezar a escribir en él */
  validations.forEach(({ id, errId }) => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(errId).style.display = 'none';
    });
  });


  /* ----------------------------------------------------------------
     GUARDAR PRODUCTO
     Valida, crea el objeto y lo añade al array en localStorage
     ---------------------------------------------------------------- */
document.getElementById('saveBtn').addEventListener('click', async () => {
  if (!validate()) return;

  const newProduct = {
    name:     document.getElementById('prodName').value.trim(),
    desc:     document.getElementById('prodDesc').value.trim(),
    category: document.getElementById('prodCat').value,
    stock:    parseInt(document.getElementById('prodStock').value),
    buyPrice: parseFloat(document.getElementById('prodBuy').value),
    price:    parseFloat(document.getElementById('prodSell').value),
    img:      imgData,
  };

  try {
    await createProduct(newProduct);
    showToast('Producto guardado correctamente ✓');
    setTimeout(() => window.location.href = '2_dashboard.html', 1200);
  } catch (e) {
    alert('No fue posible guardar el producto en el backend.');
  }
});

});