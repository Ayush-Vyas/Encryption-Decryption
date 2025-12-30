import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

app = FastAPI()

# Load or generate AES key
KEY_PATH = "aes_key.bin"
if not os.path.exists(KEY_PATH):
    key = os.urandom(16)  # 128-bit key
    with open(KEY_PATH, "wb") as f:
        f.write(key)
else:
    with open(KEY_PATH, "rb") as f:
        key = f.read()


def encrypt_file(file_path, output_path):
    iv = os.urandom(16)  # unique IV per file
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    with open(file_path, "rb") as f:
        data = f.read()

    # padding
    pad_len = 16 - (len(data) % 16)
    data += bytes([pad_len] * pad_len)

    encrypted = encryptor.update(data) + encryptor.finalize()

    # prepend IV to encrypted file for decryption
    with open(output_path, "wb") as f:
        f.write(iv + encrypted)


def decrypt_file(file_path, output_path):
    with open(file_path, "rb") as f:
        iv = f.read(16)
        encrypted_data = f.read()

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_padded = decryptor.update(encrypted_data) + decryptor.finalize()
    pad_len = decrypted_padded[-1]
    decrypted = decrypted_padded[:-pad_len]

    with open(output_path, "wb") as f:
        f.write(decrypted)


@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("encrypted", exist_ok=True)

    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    encrypted_path = f"encrypted/{file.filename}.enc"
    encrypt_file(file_location, encrypted_path)

    return {"message": f"{file.filename} uploaded and encrypted successfully!"}


@app.get("/download/{filename}")
def download(filename: str):
    encrypted_path = f"encrypted/{filename}.enc"
    decrypted_path = f"decrypted/{filename}"

    os.makedirs("decrypted", exist_ok=True)
    decrypt_file(encrypted_path, decrypted_path)

    return FileResponse(decrypted_path, media_type="application/octet-stream", filename=filename)
