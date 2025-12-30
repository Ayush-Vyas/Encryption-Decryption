from flask import Flask, request, jsonify
import os
import json
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import hashlib

app = Flask(__name__)

UPLOAD_DIR = "./uploads"
ENCRYPTED_DIR = "./encrypted_files"
METADATA_DIR = "./file_metadata"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(ENCRYPTED_DIR, exist_ok=True)
os.makedirs(METADATA_DIR, exist_ok=True)

def hash_text(text):
    return hashlib.sha256(text.encode()).hexdigest()

def save_metadata(file_name, data):
    path = os.path.join(METADATA_DIR, file_name + ".json")
    with open(path, "w") as f:
        json.dump(data, f)

@app.route("/encrypt", methods=["POST"])
def encrypt_file():
    file = request.files.get("file")
    password = request.form.get("password")
    master_key = request.form.get("masterKey")

    if not file or not password or not master_key:
        return jsonify({"error": "File, password, and master key are required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password too short"}), 400
    if len(master_key) < 6:
        return jsonify({"error": "Master key too short"}), 400

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(file_path)

    key = hashlib.sha256(password.encode()).digest()[:16]  # AES-128 key
    cipher = AES.new(key, AES.MODE_CBC)
    iv = cipher.iv

    with open(file_path, "rb") as f:
        plaintext = f.read()
    ciphertext = cipher.encrypt(pad(plaintext, AES.block_size))

    enc_file_name = file.filename + ".enc"
    enc_file_path = os.path.join(ENCRYPTED_DIR, enc_file_name)
    with open(enc_file_path, "wb") as f:
        f.write(iv + ciphertext)

    metadata = {
        "attempts": 0,
        "locked": False,
        "password_hash": hash_text(password),
        "master_key_hash": hash_text(master_key)
    }
    save_metadata(enc_file_name, metadata)

    return jsonify({"message": "File encrypted successfully", "filename": enc_file_name})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
