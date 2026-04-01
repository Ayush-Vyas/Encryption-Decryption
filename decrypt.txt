import { useState, useEffect } from "react";

export default function Decrypt() {
  const [password, setPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [passwordLocked, setPasswordLocked] = useState(false);

  useEffect(() => {
    if (!selectedFile) return;
    const key = `decrypt_attempts_${selectedFile.name}`;
    const usedAttempts = Number(localStorage.getItem(key)) || 0;
    const remaining = 3 - usedAttempts;
    setAttemptsLeft(remaining);
    setPasswordLocked(remaining <= 0);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".enc")) {
      setFileError("⚠️ Only .enc files allowed.");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }
    setFileError("");
    setSelectedFile(file);
    setPassword("");
    setMasterKey("");
  };

  const handleDecrypt = async () => {
    if (!selectedFile) {
      alert("⚠️ Upload a valid .enc file.");
      return;
    }
    if (!passwordLocked && !password) {
      alert("⚠️ Enter decryption password.");
      return;
    }
    if (passwordLocked && !masterKey) {
      alert("❌ Password locked. Enter Master Key.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (!passwordLocked) formData.append("password", password);
    else formData.append("masterKey", masterKey);

    const attemptKey = `decrypt_attempts_${selectedFile.name}`;

    try {
      const res = await fetch("http://localhost:5000/decrypt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        if (!passwordLocked) {
          const usedAttempts = Number(localStorage.getItem(attemptKey)) || 0;
          const newAttempts = usedAttempts + 1;
          localStorage.setItem(attemptKey, String(newAttempts));
          const remaining = 3 - newAttempts;
          setAttemptsLeft(remaining);
          if (remaining <= 0) {
            setPasswordLocked(true);
            alert("❌ Password locked! Use Master Key.");
          } else {
            alert(`❌ Wrong password. Attempts left: ${remaining}`);
          }
        } else {
          alert(data.error || "❌ Invalid Master Key.");
        }
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedFile.name.replace(".enc", "");
      a.click();
      window.URL.revokeObjectURL(url);

      alert("🎉 File decrypted successfully!");
      localStorage.removeItem(attemptKey);
      setAttemptsLeft(3);
      setPasswordLocked(false);
      setPassword("");
      setMasterKey("");
    } catch (err) {
      console.error(err);
      alert("❌ Decryption failed.");
    }
  };

  return (
    <>
      {/* Floating locks/keys background */}
      <div className="floating-icons">
        <i style={{ left: '10%', animationDuration: '12s' }}>🔒</i>
        <i style={{ left: '25%', animationDuration: '15s', fontSize: '35px' }}>🔑</i>
        <i style={{ left: '50%', animationDuration: '18s', fontSize: '28px' }}>🔒</i>
        <i style={{ left: '70%', animationDuration: '14s', fontSize: '32px' }}>🔑</i>
        <i style={{ left: '85%', animationDuration: '16s', fontSize: '30px' }}>🔒</i>
      </div>

      <div className="card">
        <div className="top-note">
          ⚠️ Only 3 password attempts allowed. After that, Master Key is required.
        </div>

        <h2>Decrypt Your File 🔓</h2>

        <input type="file" accept=".enc" onChange={handleFileChange} />
        {fileError && <div className="warning">{fileError}</div>}

        <div className="note">Decryption Password</div>
        <input
          type="password"
          value={password}
          disabled={passwordLocked}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={passwordLocked ? "Password Locked" : "Enter password"}
        />

        <div className="note">Master Key</div>
        <input
          type="password"
          value={masterKey}
          onChange={(e) => setMasterKey(e.target.value)}
          placeholder="Required after 3 attempts"
        />

        <div className="note">
          Attempts Left: <b>{attemptsLeft}</b>
        </div>

        <button className="btn" onClick={handleDecrypt}>
          Decrypt Now
        </button>
      </div>

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
  background: url('/encryption-bg.gif') no-repeat center center fixed;
  background-size: cover;
  color: var(--text-color);
  overflow-x: hidden;
}

/* Floating icons */
.floating-icons {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
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

.card::after {
  content: "";
  position: absolute;
  top: 15px; right: 15px;
  width: 60px; height: 60px;
  background: url('/lock.gif') no-repeat center center;
  background-size: contain;
  animation: floatLock 3s ease-in-out infinite;
  z-index: 10;
}

@keyframes floatLock {
  0%,100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(-5deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  75% { transform: translateY(-5px) rotate(-5deg); }
}

.top-note {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--primary-color);
  border-left: 6px solid var(--primary-color);
  border-radius: 10px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  animation: fadeInDown 1s ease forwards;
}

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
  transition: transform 0.3s;
}
.note:hover { transform: scale(1.05); }

.warning {
  background-color: rgba(220, 38, 38, 0.15);
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  animation: shake 0.3s ease;
}
@keyframes shake {
  0% { transform: translateX(0); } 25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); } 75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

input {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: border var(--transition-speed), box-shadow var(--transition-speed), transform 0.3s;
}
input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 12px rgba(16,185,129,0.3);
  transform: scale(1.02);
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
  transition: transform var(--transition-speed), background-color var(--transition-speed), box-shadow var(--transition-speed);
  position: relative;
  overflow: hidden;
}
.btn:hover {
  background-color: var(--accent-color-hover);
  transform: scale(1.05) rotate(-1deg);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}
.btn:after {
  content: "";
  position: absolute;
  width: 100px; height: 100px;
  background: rgba(255,255,255,0.3);
  display: block;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
  left: 50%; top: 50%;
  transition: transform 0.5s, opacity 1s;
}
.btn:active:after {
  transform: translate(-50%, -50%) scale(2);
  opacity: 1;
  transition: 0s;
}

@keyframes fadeInDown {0% {opacity:0; transform:translateY(-20px);}100% {opacity:1; transform:translateY(0);}}
@keyframes fadeInUp {0% {opacity:0; transform:translateY(20px);}100% {opacity:1; transform:translateY(0);}}
      `}</style>
    </>
  );
}
