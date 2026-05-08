// ======= Data =======
let productos = [];
let editIndex = null;
let deleteIndex = null;
let imagenPreview = null;

if (typeof PRODUCTOS !== "undefined" && PRODUCTOS.length > 0) {
    productos = PRODUCTOS.map(p => ({
        campos: p,
        imagen: p.imagen || null
    }));
}

// ======= Selectores =======
const container = document.getElementById('product-list');

// Modal Producto
const modal = document.getElementById('modal-producto');
const openBtn = document.getElementById('add-product');
const closeBtn = document.getElementById('close-modal');
const saveBtn = document.getElementById('save-product');

// Campos
const formContainer = document.getElementById('form-container');

// Imagen
const imagenInput = document.getElementById('imagen');
const previewImg = document.getElementById('preview-img');
const changeImageBtn = document.getElementById('change-image');

// Modal Campo
const modalField = document.getElementById('modal-field');
const addFieldBtn = document.getElementById('add-field');
const saveFieldBtn = document.getElementById('save-field');
const closeFieldBtn = document.getElementById('close-field');
const fieldNameInput = document.getElementById('field-name');

// Modal Eliminar
const modalDelete = document.getElementById('modal-delete');
const deletePreview = document.getElementById('delete-preview');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

// Validacion para el PDF

const btnPDF = document.getElementById('end-pdf');

const modalValidacion = document.getElementById('modal-validacion');
const validacionContent = document.getElementById('validacion-content');

const prevBtn = document.getElementById('prev-product');
const nextBtn = document.getElementById('next-product');
const editBtn = document.getElementById('edit-product');
const deleteBtn = document.getElementById('delete-product');
const closeValidacion = document.getElementById('close-validacion');


// ======= Modal =======
openBtn.onclick = () => {
    limpiarForm();
    modal.classList.add('show');
};

closeBtn.onclick = () => modal.classList.remove('show');

// ======= Campos =======
function crearCampo(nombre, valor = "") {
    const div = document.createElement('div');
    div.classList.add('field-item');

    const key = document.createElement('label');
    key.textContent = nombre;

    const value = document.createElement('input');
    value.value = valor;
    value.placeholder = "Valor";

    div.appendChild(key);
    div.appendChild(value);

    formContainer.appendChild(div);
}

// ======= Agregar Campo =======
addFieldBtn.onclick = () => modalField.classList.add('show');

closeFieldBtn.onclick = () => {
    modalField.classList.remove('show');
    fieldNameInput.value = "";
};

saveFieldBtn.onclick = () => {
    const name = fieldNameInput.value.trim();
    if (!name) return;

    crearCampo(name);

    modalField.classList.remove('show');
    fieldNameInput.value = "";
};

// ======= Imagen =======
changeImageBtn.onclick = () => imagenInput.click();

imagenInput.addEventListener('change', () => {
    const file = imagenInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        imagenPreview = e.target.result;
        previewImg.src = imagenPreview;
    };
    reader.readAsDataURL(file);
});

// ======= Guardar =======
saveBtn.onclick = () => {

    const campos = {};
    document.querySelectorAll('.field-item').forEach(item => {
        const key = item.children[0].textContent;
        const value = item.children[1].value;
        campos[key] = value;
    });

    const producto = {
        campos,
        imagen: imagenPreview
    };

    if (editIndex !== null) {
        productos[editIndex] = producto;
        editIndex = null;
    } else {
        productos.push(producto);
    }

    render();
    modal.classList.remove('show');
};

// ======= Render =======
function render() {
    container.innerHTML = "";
    const imagenDefault = "/static/img/SinImagen.jpg";

    productos.forEach((p, i) => {

        let html = "";
        for (let key in p.campos) {
            html += `<p><strong>${key}:</strong> ${p.campos[key] ?? ""}</p>`;
        }

        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <div class="image-container">
                <img src="${p.imagen || imagenDefault}">
            </div>
            ${html}
            <div class="product-actions">
                <button onclick="editar(${i})">Editar</button>
                <button onclick="eliminar(${i})">Eliminar</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// ======= Editar =======
function editar(index) {
    const p = productos[index];

    formContainer.innerHTML = "";

    for (let key in p.campos) {
        crearCampo(key, p.campos[key]);
    }

    imagenPreview = p.imagen;
    previewImg.src = p.imagen || "/static/img/SinImagen.jpg";

    editIndex = index;
    modal.classList.add('show');
}

// ======= Eliminar =======
function eliminar(index) {
    const p = productos[index];
    deleteIndex = index;

    let html = "";
    for (let key in p.campos) {
        html += `<p><strong>${key}:</strong> ${p.campos[key]}</p>`;
    }

    deletePreview.innerHTML = `
        <img src="${p.imagen || '/static/img/SinImagen.jpg'}"
             style="width:100%; max-height:120px; object-fit:contain;">
        ${html}
    `;

    modalDelete.classList.add('show');
}

confirmDeleteBtn.onclick = () => {
    if (deleteIndex !== null) {
        productos.splice(deleteIndex, 1);
        deleteIndex = null;
        render();
    }
    modalDelete.classList.remove('show');
};

cancelDeleteBtn.onclick = () => {
    modalDelete.classList.remove('show');
    deleteIndex = null;
};

// ======= Limpia Form =======
function limpiarForm() {
    formContainer.innerHTML = "";
    imagenInput.value = "";
    imagenPreview = null;
    previewImg.src = "/static/img/SinImagen.jpg";
}

// ========================= Validacion para el PDF =========================
let productosSinImagen = [];
let indexValidacion = 0;

// ===== Boton Crear PDF =====
btnPDF.onclick = () => {

    productosSinImagen = productos
        .map((p, i) => ({ ...p, index: i }))
        .filter(p => !p.imagen);

    if (productosSinImagen.length > 0) {
        indexValidacion = 0;
        mostrarProductoValidacion();
        modalValidacion.classList.add('show');
    } else {
        continuarPDF();
    }
};

// ===== Mostramos el producto sin imagen =====
function mostrarProductoValidacion() {

    const p = productosSinImagen[indexValidacion];

    let html = "";

    for (let key in p.campos) {
        html += `<p><strong>${key}:</strong> ${p.campos[key] ?? ""}</p>`;
    }

    validacionContent.innerHTML = `
        <div class="product-card">
            <div class="image-container">
                <img src="/static/img/SinImagen.jpg">
            </div>
            ${html}
        </div>
        <p>${indexValidacion + 1} de ${productosSinImagen.length}</p>
    `;
}

// ===== NAVEGACIÓN =====
nextBtn.onclick = () => {
    if (indexValidacion < productosSinImagen.length - 1) {
        indexValidacion++;
        mostrarProductoValidacion();
    } else {
        modalValidacion.classList.remove('show');
        continuarPDF();
    }
};

prevBtn.onclick = () => {
    if (indexValidacion > 0) {
        indexValidacion--;
        mostrarProductoValidacion();
    }
};

// ===== Editar desde modal pdf =====
editBtn.onclick = () => {
    const p = productosSinImagen[indexValidacion];

    modalValidacion.classList.remove('show');
    editar(p.index);
};

// ===== Eliminar desde modal pdf =====
deleteBtn.onclick = () => {

    const p = productosSinImagen[indexValidacion];

    productos.splice(p.index, 1);

    // actualizar lista
    productosSinImagen = productos
        .map((p, i) => ({ ...p, index: i }))
        .filter(p => !p.imagen);

    if (productosSinImagen.length === 0) {
        modalValidacion.classList.remove('show');
        render();
        return;
    }

    if (indexValidacion >= productosSinImagen.length) {
        indexValidacion = productosSinImagen.length - 1;
    }

    render();
    mostrarProductoValidacion();
};

// ===== Cerrar Validacion =====
closeValidacion.onclick = () => {
    modalValidacion.classList.remove('show');
};


// ===== Continuar con el PDF =====
async function continuarPDF() {
    try {
        const response = await fetch('/crear-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productos)
        });
        if (!response.ok) {
            alert("Error al generar PDF");
            return;
        }

        // Descargar PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "catalogo.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error(error);
        alert("Error inesperado");
    }
}

// ======= INIT =======
render();