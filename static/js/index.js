// Modal Inicial
const openInicial = document.getElementById('open-modal-inicial');
const modalInicial = document.getElementById('modal-inicial');
const closeInicial = document.getElementById('close-modal-inicial');
// Modal de Excel
const openExcel = document.getElementById('open-modal-excel');
const modalExcel = document.getElementById('modal-excel');
const closeExcel = document.getElementById('close-modal-excel');
// Excel Mapping
const form = document.getElementById('excel-form');
const container = document.getElementById('columns-container');
const uploadSection = document.getElementById('excel-upload');
const mappingSection = document.getElementById('excel-mapping');
const backToUpload = document.getElementById('back-to-upload');
const addColumnBtn = document.getElementById('add-column');

const BtnExcel = document.getElementById('continue-btn');
const BtnManual = document.getElementById('formulario-manual');

// Funcion General de Modales
function openModal(modal) {
    modal.classList.add('show');
}

function closeModal(modal) {
    modal.classList.remove('show');
}

// ======= Eventos Modales abrir/cerrar =======
// Modal Inicial
openInicial.addEventListener('click', () => openModal(modalInicial));
closeInicial.addEventListener('click', () => closeModal(modalInicial));

// Modal Excel
openExcel.addEventListener('click', () => {
    closeModal(modalInicial);
    openModal(modalExcel);
    // Reset estado
    uploadSection.style.display = 'block';
    mappingSection.style.display = 'none';
    container.innerHTML = "";
    form.reset();
});

closeExcel.addEventListener('click', () => {
    closeModal(modalExcel);
    openModal(modalInicial);
});

// ======= Evento del Excel subir archivo y confirmar mapeo de datos =======
let newColumnCount = 1;

// SUBIR EXCEL
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
        const response = await fetch('/upload-excel', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            alert("Error al procesar el archivo");
            return;
        }
        const data = await response.json();
        generarMapeo(data.columns);
        // Cambiar vista
        uploadSection.style.display = 'none';
        mappingSection.style.display = 'block';
    } catch (error) {
        console.error(error);
        alert("Error inesperado");
    }
});

// Retroceder a subir Excel / cambiar archivo subido
backToUpload.addEventListener('click', () => {
    mappingSection.style.display = 'none';
    uploadSection.style.display = 'block';
    form.reset();
});

// Mapeo de columnas del Excel / archivo subido
function generarMapeo(columnas) {
    container.innerHTML = "";
    newColumnCount = 1;
    columnas.forEach(col => {
        const bloque = crearBloque(
            col,
            col.replace(/\s+/g, "_").toLowerCase(),
            "Nombre, Precio, etc..."
        );
        container.appendChild(bloque);
    });
}

// Agregar nueva columna extra al mapeo
addColumnBtn.addEventListener('click', () => {
    const bloque = crearBloque(
        `Nueva ${newColumnCount}`,
        `nueva_${newColumnCount}`,
        `Nueva Columna ${newColumnCount}`,
        true
    );
    container.appendChild(bloque);
    newColumnCount++;
});

// Crear bloque de mapeo para cada columna del Excel o nueva columna extra
function crearBloque(labelText, inputName, placeholder, esExtra = false) {

    const wrapper = document.createElement('div');
    wrapper.classList.add('column-item');

    const label = document.createElement('label');
    label.innerText = labelText;

    const input = document.createElement('input');
    input.type = 'text';

    // 🔥 CLAVE TOTAL
    input.name = labelText;  // columna real Excel

    input.placeholder = placeholder;

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    if (esExtra) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.innerText = "✖";
        deleteBtn.classList.add('delete-column');

        deleteBtn.addEventListener('click', () => {
            wrapper.remove();
        });

        wrapper.appendChild(deleteBtn);
    }

    return wrapper;
}

// Fomulario final o vista final de producto y cracion de pdf

// Base de datos con las columnas de excel
BtnExcel.addEventListener('click', async () => {

    const formData = new FormData();

    const fileInput = document.querySelector('input[type="file"]');
    formData.append('file', fileInput.files[0]);

    const inputs = container.querySelectorAll('input');

    inputs.forEach(input => {
        formData.append(input.name, input.value);
    });

    try {
        const response = await fetch('/procesar-excel', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            alert("Error al procesar Excel");
            return;
        }

        const data = await response.json();

        // Guardar en sesión
        await fetch('/configurar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                modo: "excel",
                columnas: data.columnas,
                productos: data.productos
            })
        });

        // Redirigir
        window.location.href = "/productos";

    } catch (error) {
        console.error(error);
        alert("Error inesperado");
    }
});

// Sin Base de datos carga de productos manual 1 dato de ejemplo.
BtnManual.addEventListener('click', async () => {

    const productoEjemplo = [{
        nombre: "Producto 1",
        precio: "123456.78",
        descripcion: "Esto es un ejemplo de un producto.",
        imagen: "https://via.placeholder.com/300"
    }];

    await fetch('/configurar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            modo: "manual",
            columnas: ["nombre", "precio", "descripcion", "imagen"],
            productos: productoEjemplo
        })
    });

    window.location.href = "/productos";
});