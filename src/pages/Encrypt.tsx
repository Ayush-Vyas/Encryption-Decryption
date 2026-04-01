import { useState } from "react";

export default function Encrypt() {
  const [showAES, setShowAES] = useState(false);

  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [masterKey, setMasterKey] = useState("");
  const [email, setEmail] = useState("");
  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /* 🔹 ADDED STATE (does not affect existing code) */
  const [isDragging, setIsDragging] = useState(false);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[a-z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    return score;
  };

  const getStrengthLabel = (score: number) => {
    if (score === 0) return "";
    if (score <= 50) return "Weak";
    if (score < 100) return "Medium";
    return "Strong";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(calculateStrength(val));
  };

  /* 🔹 ORIGINAL FILE VALIDATION (unchanged) */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFileError("⚠️ Only PDF, JPG, JPEG, and PNG files are allowed.");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  /* 🔹 DRAG & DROP HANDLERS (NEW, SAFE ADDITION) */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFileError("⚠️ Only PDF, JPG, JPEG, and PNG files are allowed.");
      setSelectedFile(null);
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  const handleEncrypt = async () => {
    setShowAES(true);
    if (!selectedFile) return alert("⚠️ Please upload a file.");
    if (strength < 100) return alert("⚠️ Password too weak.");
    if (!masterKey || masterKey.length < 6)
      return alert("❌ Master Key required (min 6 chars).");
    if (!email || !/\S+@\S+\.\S+/.test(email))
      return alert("❌ Valid email required to receive Master Key.");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("password", password);
    formData.append("masterKey", masterKey);
    formData.append("email", email);

    try {
      const res = await fetch("http://localhost:5000/encrypt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedFile.name + ".enc";
      a.click();
      window.URL.revokeObjectURL(url);

      alert("🎉 File encrypted, downloaded, and Master Key emailed successfully!");
      setPassword("");
      setMasterKey("");
      setEmail("");
      setSelectedFile(null);
      setStrength(0);
    } catch (err) {
      alert("❌ Encryption failed. Check if backend server is running.");
    }
  };

  return (
    <>
     <style>{`
:root {
  --card-bg: rgba(255, 255, 255, 0.95);
  --primary-color: #16a085;
  --accent-color: #16a085;
  --accent-color-hover: #138d75;
  --text-color: #064e3b;
  --shadow-color: rgba(0, 0, 0, 0.15);
  --note-green: #10b981;
  --transition-speed: 0.3s;
  --input-border: #d1d5db;
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #f0fdf4;
  overflow-x: hidden;
  position: relative;
}

/* Floating icons background */
.floating-icons {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.floating-icons i {
  position: absolute;
  font-size: 30px;
  color: rgba(22,160,133,0.3);
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.4; }
  50% { opacity: 0.6; }
  100% { transform: translateY(-50px) rotate(360deg); opacity: 0; }
}

.card {
  position: relative;
  width: 600px;
  max-width: 95%;
  padding: 3.5rem 3rem;
  border-radius: 18px;
  background-color: var(--card-bg);
  box-shadow: 0 10px 40px var(--shadow-color);
  margin: 2rem auto;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  backdrop-filter: blur(8px);
  animation: fadeInUp 1s ease forwards;
  box-sizing: border-box;
  z-index: 1;
}

.top-note {
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--primary-color);
  border-left: 6px solid var(--primary-color);
  border-radius: 10px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 50px var(--shadow-color);
}

.card::after {
  content: "";
  position: absolute;
  top: 15px;
  right: 15px;
  width: 60px;
  height: 60px;
  background: url('/lock.gif') no-repeat center center;
  background-size: contain;
  animation: floatLock 3s ease-in-out infinite;
}

@keyframes floatLock {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(-5deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  75% { transform: translateY(-5px) rotate(-5deg); }
}

@keyframes fadeInDown {0% {opacity:0; transform:translateY(-20px);}100% {opacity:1; transform:translateY(0);} }
@keyframes fadeInUp {0% {opacity:0; transform:translateY(20px);}100% {opacity:1; transform:translateY(0);} }

.card h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
  text-shadow: 1px 1px 4px rgba(0,0,0,0.1);
}

.note {
  background-color: var(--note-green);
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.warning {
  background-color: rgba(220, 38, 38, 0.15);
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

input {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  margin-bottom: 1rem;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 12px rgba(16,185,129,0.3);
}

.btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background-color: var(--accent-color);
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn:hover {
  background-color: var(--accent-color-hover);
  transform: scale(1.05);
}

.strength-bar {
  height: 10px;
  width: 100%;
  background: rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  width: 0%;
  border-radius: 8px;
  transition: width 0.5s ease, background-color 0.5s ease;
  background-color: var(--accent-color);
}

.strength-label {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: var(--text-color);
  text-align: center;
}

.master-key-label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}
      `}</style>
      <div className="floating-icons">
        <i style={{ left: "10%", animationDuration: "12s" }}>🔒</i>
        <i style={{ left: "25%", animationDuration: "15s", fontSize: "35px" }}>🔑</i>
        <i style={{ left: "50%", animationDuration: "18s", fontSize: "28px" }}>🔒</i>
        <i style={{ left: "70%", animationDuration: "14s", fontSize: "32px" }}>🔑</i>
        <i style={{ left: "85%", animationDuration: "16s", fontSize: "30px" }}>🔒</i>
      </div>

      <div className="card">
        <div className="top-note">
          ⚠️ Always keep your Master Key secure. Files encrypted without the correct
          Master Key cannot be decrypted.
        </div>

        <h2>Encrypt Your File 🔐</h2>

        <div className="note">File types allowed: PDF, JPG, JPEG, PNG</div>

        {/* 🔹 DRAG & DROP ZONE (ADDED, NO CSS CHANGE) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging
              ? "2px dashed #16a085"
              : "2px dashed #a7f3d0",
            padding: "1.4rem",
            borderRadius: "12px",
            textAlign: "center",
            marginBottom: "1rem",
            fontWeight: "bold",
            color: "#065f46",
          }}
        >
          {selectedFile
            ? `📄 ${selectedFile.name}`
            : "📥 Drag & Drop your file here"}
        </div>

        {/* 🔹 ORIGINAL INPUT (UNCHANGED) */}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />

        {fileError && <div className="warning">{fileError}</div>}

        <div className="note">Enter Encryption Password</div>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Strong password"
        />

        <div className="strength-bar">
          <div
            className="strength-fill"
            style={{
              width: `${strength}%`,
              backgroundColor:
                strength < 50
                  ? "#f87171"
                  : strength < 100
                  ? "#facc15"
                  : "#16a085",
            }}
          />
        </div>

        <div className="strength-label">
          {password && `Password Strength: ${getStrengthLabel(strength)}`}
        </div>

        <div className="master-key-label">Master Key (Required)</div>
        <input
          type="password"
          value={masterKey}
          onChange={(e) => setMasterKey(e.target.value)}
          placeholder="Min 6 characters"
        />

        <div className="master-key-label">Your Email (Required)</div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to receive Master Key"
        />

        <button className="btn" onClick={handleEncrypt}>
          Encrypt Now
        </button>
      </div>
    </>
  );
}
