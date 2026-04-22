from flask import Flask, render_template, request, jsonify, redirect, url_for
import pandas as pd
app = Flask(__name__)

# Landing page
@app.route('/')
def index():
    return render_template('index.html')

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

if __name__ == '__main__':
    app.run(debug=True)