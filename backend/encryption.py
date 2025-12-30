from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import os

BLOCK_SIZE = 16  # AES block size

def encrypt_file(file_path, output_path, key):
    with open(file_path, 'rb') as f:
        data = f.read()

    cipher = AES.new(key.encode(), AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(data, BLOCK_SIZE))
    
    with open(output_path, 'wb') as f:
        f.write(cipher.iv + ct_bytes)  # prepend IV

def decrypt_file(file_path, output_path, key):
    with open(file_path, 'rb') as f:
        iv = f.read(16)
        ct = f.read()

    cipher = AES.new(key.encode(), AES.MODE_CBC, iv)
    data = unpad(cipher.decrypt(ct), BLOCK_SIZE)

    with open(output_path, 'wb') as f:
        f.write(data)
