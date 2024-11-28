from flask import Flask, render_template, jsonify
from implementaciones.img_to_ascii import img_to_ascii
from implementaciones.all_archs import get_archs
import random

app = Flask(__name__)

# Obtener la lista de imágenes disponibles
path_to_imgs = get_archs("imagenes/")
cant_imgs = len(path_to_imgs)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get-dimensions")
def get_dimensions():
    try:
        # Seleccionar una imagen al azar
        img_idx = random.randint(0, cant_imgs - 1)
        cad, height, width = img_to_ascii(path_to_imgs[img_idx])
        return jsonify({"width": width, "height": height, "cad": cad})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
