from flask import Flask, request, send_file, jsonify
import os
import json
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import hashlib

app = Flask(__name__)

ENCRYPTED_DIR = "./encrypted_files"
METADATA_DIR = "./file_metadata"
DECRYPTED_DIR = "./decrypted_files"

os.makedirs(DECRYPTED_DIR, exist_ok=True)

def hash_text(text):
    return hashlib.sha256(text.encode()).hexdigest()

def get_metadata(file_name):
    path = os.path.join(METADATA_DIR, file_name + ".json")
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return {"attempts": 0, "locked": False, "password_hash": None, "master_key_hash": None}

def save_metadata(file_name, data):
    path = os.path.join(METADATA_DIR, file_name + ".json")
    with open(path, "w") as f:
        json.dump(data, f)

@app.route("/decrypt", methods=["POST"])
def decrypt_file():
    file = request.files.get("file")
    password = request.form.get("password")
    master_key = request.form.get("masterKey")

    if not file:
        return jsonify({"error": "File required"}), 400

    enc_file_name = file.filename
    enc_file_path = os.path.join(ENCRYPTED_DIR, enc_file_name)
    if not os.path.exists(enc_file_path):
        return jsonify({"error": "Encrypted file not found"}), 404

    metadata = get_metadata(enc_file_name)

    # Locked state handling
    if metadata["locked"]:
        if not master_key or hash_text(master_key) != metadata["master_key_hash"]:
            return jsonify({"error": "File is locked. Enter correct master key"}), 403
        metadata["locked"] = False
        metadata["attempts"] = 0
        save_metadata(enc_file_name, metadata)

    # Password check if not locked
    elif hash_text(password) != metadata["password_hash"]:
        metadata["attempts"] += 1
        if metadata["attempts"] >= 3:
            metadata["locked"] = True
            save_metadata(enc_file_name, metadata)
            return jsonify({"error": "Wrong password. File locked. Use master key to unlock."}), 403
        save_metadata(enc_file_name, metadata)
        return jsonify({"error": f"Wrong password. Attempts: {metadata['attempts']}/3"}), 403

    # Decrypt
    with open(enc_file_path, "rb") as f:
        data = f.read()
    iv = data[:16]
    ciphertext = data[16:]
    key_text = password if not metadata["locked"] else master_key
    key = hashlib.sha256(key_text.encode()).digest()[:16]

    cipher = AES.new(key, AES.MODE_CBC, iv)
    try:
        plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
    except:
        return jsonify({"error": "Decryption failed"}), 400

    dec_file_path = os.path.join(DECRYPTED_DIR, enc_file_name.replace(".enc", ""))
    with open(dec_file_path, "wb") as f:
        f.write(plaintext)

    save_metadata(enc_file_name, metadata)
    return send_file(dec_file_path, as_attachment=True)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
