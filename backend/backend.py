# backend.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import os

app = Flask(__name__)
CORS(app)  # Allow React frontend

UPLOAD_FOLDER = "uploads"
ENCRYPTED_FOLDER = "encrypted"

# Create folders if not exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)

# AES-128 key generator (16 bytes)
def generate_aes_key(password: str, master_key: str) -> bytes:
    combined = (password + master_key).encode("utf-8")
    return combined[:16].ljust(16, b'0')  # truncate/pad to 16 bytes

@app.route("/encrypt", methods=["POST"])
def encrypt_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    password = request.form.get("password")
    master_key = request.form.get("masterKey")

    if not password or not master_key or not file:
        return jsonify({"error": "Missing password, master key, or file"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password too short"}), 400
    if len(master_key) < 6:
        return jsonify({"error": "Master key too short"}), 400

    # Save original file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Encrypt file
    key = generate_aes_key(password, master_key)
    cipher = AES.new(key, AES.MODE_CBC)
    iv = cipher.iv

    with open(file_path, "rb") as f:
        data = f.read()
    ciphertext = cipher.encrypt(pad(data, AES.block_size))

    encrypted_file_path = os.path.join(ENCRYPTED_FOLDER, file.filename + ".enc")
    with open(encrypted_file_path, "wb") as f:
        f.write(iv + ciphertext)  # prepend IV for decryption

    return jsonify({
        "message": f'File "{file.filename}" encrypted successfully!',
        "filename": file.filename + ".enc"
    })

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    path = os.path.join(ENCRYPTED_FOLDER, filename)
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(port=5000, debug=True)
