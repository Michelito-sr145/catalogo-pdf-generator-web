from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import pandas as pd
app = Flask(__name__)
app.secret_key = "clave_secreta"

# ============== Landing page ==============
@app.route('/')
def index():
    return render_template('index.html')

# ============== CARGA DE COLUMNAS DEL EXCEL ==============
@app.route('/upload-excel', methods=['POST'])
def upload_excel():
    file = request.files['file']
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    df = pd.read_excel(file)
    # Obtener nombres de columnas
    columns = df.columns.tolist()
    return jsonify({
        "columns": columns
    })

# ========================= CONFIGURAR (guardar estado) =========================
@app.route('/configurar', methods=['POST'])
def configurar():
    data = request.json
    session['modo'] = data.get('modo')
    session['columnas'] = data.get('columnas')
    session['productos'] = data.get('productos')
    return jsonify({"ok": True})

# ========================= PROCESAR EXCEL =========================
@app.route('/procesar-excel', methods=['POST'])
def procesar_excel():
    file = request.files['file']
    mapeo = request.form.to_dict()

    df = pd.read_excel(file)

    productos = []

    for _, fila in df.iterrows():
        producto = {}

        for col_excel, campo_usuario in mapeo.items():

            # si el usuario no definió nada → ignorar
            if campo_usuario.strip() == "":
                continue

            # 👉 si existe en Excel
            if col_excel in df.columns:
                valor = fila.get(col_excel)

                if pd.isna(valor):
                    valor = None

            else:
                # 👉 columna extra creada por el usuario
                valor = None

            producto[campo_usuario] = valor

        productos.append(producto)

    # columnas finales (las que definió el usuario)
    columnas = list(productos[0].keys()) if productos else []

    return jsonify({
        "productos": productos,
        "columnas": columnas
    })
# ========================= PRODUCTOS =========================
@app.route('/productos')
def productos():
    columnas = session.get('columnas', [])
    productos = session.get('productos', [])

    return render_template(
        'productos.html',
        columnas=columnas,
        productos=productos
    )

if __name__ == '__main__':
    app.run(debug=True)