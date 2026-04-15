# 🔐 Encryption-Decryption System

A secure web-based application that allows users to encrypt and decrypt files using a password and a custom master key. Built with a modern React frontend and a Python backend, this system ensures data confidentiality and controlled access.

---

## 🚀 Features

* 🔒 File Encryption (PDF, JPG, PNG, etc.)
* 🔓 File Decryption using Password + Master Key
* 🧠 Dual Security Layer (User Password + Master Key)
* 📤 File Upload & Processing
* ⚡ Real-time Encryption/Decryption Handling
* 🖥️ Interactive UI (React-based)
* 🛡️ Secure Data Handling

---

## 🧰 Tech Stack

* **Frontend:** React (TSX), HTML, CSS
* **Backend:** Python (Flask / FastAPI)
* **Security:** Custom Encryption Logic
* **File Handling:** Python File I/O
* **Deployment Ready:** Vercel (Frontend) + Backend Server

---

## 📁 Project Structure

```id="enc1"
encryption-decryption/
│
├── frontend/              # React App
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/               # Python Backend
│   ├── app.py / main.py
│   ├── encryption.py
│   ├── requirements.txt
│
├── uploads/               # Uploaded files
├── encrypted_files/       # Encrypted outputs
├── decrypted_files/       # Decrypted outputs
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🟢 1. Clone Repository

```bash
git clone https://github.com/yourusername/encryption-decryption.git
cd encryption-decryption
```

---

### 🟢 2. Backend Setup (Python)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

👉 Server runs on:

```
http://localhost:5000
```

---

### 🟢 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

👉 App runs on:

```
http://localhost:3000
```

---

## 🔐 How It Works

1. User uploads a file
2. Enters:

   * Password
   * Master Key
3. File gets encrypted using custom algorithm
4. For decryption:

   * Same password + master key required

---

## ⚠️ Security Notes

* Do not expose encryption keys publicly
* Avoid uploading sensitive real-world data
* Backend should be secured before production deployment

---

## 📸 Screenshots

<img width="1898" height="920" alt="image" src="https://github.com/user-attachments/assets/5085155f-b576-4a7e-9cf8-ed32a34c1c61" />

* Upload Interface
* Encryption Process
* Decryption Output

---

## 📌 Future Enhancements

* AES / Advanced Encryption Integration
* Drag & Drop File Upload
* Progress Loader & Animations
* Cloud Storage Integration
* User Authentication System

---

## 👨‍💻 Authors

* Ayush Vyas
* Aarchi Patel

---

## ⭐ Support

If you found this project useful, give it a ⭐ on GitHub!

---
