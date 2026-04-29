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
    if (imagenInput.files[0]) {
        imagenPreview = URL.createObjectURL(imagenInput.files[0]);
        previewImg.src = imagenPreview;
    }
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

// ======= INIT =======
render();