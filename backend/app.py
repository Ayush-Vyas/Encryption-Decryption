from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import os
import hashlib

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
ENCRYPTED_FOLDER = "encrypted"
DECRYPTED_FOLDER = "decrypted"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)
os.makedirs(DECRYPTED_FOLDER, exist_ok=True)

AES_BLOCK_SIZE = 16

# Derive AES-128 key from password + masterKey
def derive_key(password, master_key):
    data = (password + master_key).encode("utf-8")
    return hashlib.sha256(data).digest()[:16]

# ---------------- ENCRYPT ----------------
@app.route("/encrypt", methods=["POST"])
def encrypt_file():
    file = request.files.get("file")
    password = request.form.get("password")
    master_key = request.form.get("masterKey")

    if not file or not password or not master_key:
        return jsonify({"error": "Missing required fields"}), 400

    key = derive_key(password, master_key)
    iv = get_random_bytes(AES_BLOCK_SIZE)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    data = file.read()
    encrypted_data = iv + cipher.encrypt(pad(data, AES_BLOCK_SIZE))

    output_path = os.path.join(ENCRYPTED_FOLDER, file.filename + ".enc")
    with open(output_path, "wb") as f:
        f.write(encrypted_data)

    return send_file(output_path, as_attachment=True)

# ---------------- DECRYPT ----------------
@app.route("/decrypt", methods=["POST"])
def decrypt_file():
    file = request.files.get("file")
    password = request.form.get("password")
    master_key = request.form.get("masterKey")

    if not file or not password or not master_key:
        return jsonify({"error": "Missing required fields"}), 400

    key = derive_key(password, master_key)
    encrypted_data = file.read()
    iv = encrypted_data[:AES_BLOCK_SIZE]
    cipher = AES.new(key, AES.MODE_CBC, iv)

    try:
        decrypted_data = unpad(cipher.decrypt(encrypted_data[AES_BLOCK_SIZE:]), AES_BLOCK_SIZE)
    except ValueError:
        return jsonify({"error": "Invalid password or master key"}), 400

    output_path = os.path.join(DECRYPTED_FOLDER, file.filename.replace(".enc", ""))
    with open(output_path, "wb") as f:
        f.write(decrypted_data)

    return send_file(output_path, as_attachment=True)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
