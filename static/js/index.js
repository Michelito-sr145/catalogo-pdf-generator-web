const openInicial = document.getElementById('open-modal-inicial');
const modalInicial = document.getElementById('modal-inicial');
const closeInicial = document.getElementById('close-modal-inicial');

const openExcel = document.getElementById('open-modal-excel');
const modalExcel = document.getElementById('modal-excel');
const closeExcel = document.getElementById('close-modal-excel');

function openModal(id_modal) {
    id_modal.classList.add('show');
}

function closeModal(id_modal) {
    id_modal.classList.remove('show');
}

// Eventos
openInicial.addEventListener('click', () => openModal(modalInicial));
closeInicial.addEventListener('click', () => closeModal(modalInicial));

// Cambio a Excel
openExcel.addEventListener('click', () => {
    closeModal(modalInicial);
    openModal(modalExcel);
});

// Volver
closeExcel.addEventListener('click', () => {
    closeModal(modalExcel);
    openModal(modalInicial);
});

const form = document.getElementById('excel-form');
const container = document.getElementById('columns-container');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const response = await fetch('/upload-excel', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    generarMapeo(data.columns);
});

function generarMapeo(columnas) {
    container.innerHTML = ""; // limpiar inputs previos

    columnas.forEach(col => {

        const label = document.createElement('label');
        label.innerText = `Columna "${col}"`;

        const select = document.createElement('select');
        select.name = col;

        select.innerHTML = `
            <option value="">-- Seleccionar --</option>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio</option>
            <option value="descripcion">Descripción</option>
            <option value="imagen">Imagen</option>
        `;

        container.appendChild(label);
        container.appendChild(select);
    });
}

// Ajustar cambiando en vez de que sea un select sea un cuadro de texto con el placeholder correcto. 
// Ajustar la carga de los datos, ya que al subir el archivo excel
// no recarga el modal. sino hacer que carge primero el excel y luego activar el formulario una vez subido el excel.
// haciendo que el formulario aparezca o que aparezca un mensaje de que no cargo correctamente o el archivo no era un excel.