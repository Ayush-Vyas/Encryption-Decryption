import { useState } from "react";

export default function Decrypt() {
  const [password, setPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

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
  };

  const handleDecrypt = async () => {
    if (!selectedFile) { alert("⚠️ Upload a valid .enc file."); return; }
    if (!password && !masterKey) { alert("⚠️ Enter password or master key."); return; }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("password", password);
    formData.append("masterKey", masterKey);

    try {
      const res = await fetch("http://localhost:5000/decrypt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error);
        setAttemptsLeft(prev => prev-1);
        if (attemptsLeft <= 1) {
          alert("❌ File locked due to multiple failed attempts!");
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

      alert("🎉 File decrypted and downloaded successfully!");
      setAttemptsLeft(3); // reset counter
    } catch (err) {
      console.error(err);
      alert("❌ Decryption failed.");
      setAttemptsLeft(prev => prev-1);
    }
  };

  return (
    <>
      <div className="card animate-fadeUp">
        <h2>Decrypt Your File 🔓</h2>
        <div className="warning">NOTE: YOU ONLY HAVE 3 ATTEMPTS TO UNLOCK OR ELSE THE FILE WILL BE LOCKED</div>
        <div className="note">File like .enc are only allowed</div>

        <input type="file" accept=".enc" onChange={handleFileChange} />
        {fileError && <div className="warning">{fileError}</div>}

        <div className="note">Enter Decryption Password</div>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Decryption password" />

        <div className="note">MASTER KEY (Optional till 3 tries)</div>
        <input type="password" value={masterKey} onChange={(e)=>setMasterKey(e.target.value)} placeholder="Master Key" />

        <div className="note">Attempts Left: {attemptsLeft}</div>

        <button className="btn" onClick={handleDecrypt}>Decrypt Now</button>
      </div>

      <style>{`
        .card {
          width:500px; padding:2.5rem; border-radius:12px;
          background-color: rgba(255,255,255,0.85);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          margin:3rem auto;
        }
        h2 { text-align:center; margin-bottom:1rem; color:#2c3e50; }
        .note { background-color:#d1fae5; color:#065f46; padding:0.6rem 1rem; border-radius:8px; margin-bottom:0.75rem; font-weight:bold; }
        .warning { background-color:#fee2e2; color:#b91c1c; padding:0.6rem 1rem; border-radius:8px; margin-bottom:0.75rem; font-weight:bold; }
        input { width:100%; padding:0.8rem 1rem; border-radius:8px; border:1px solid #d1d5db; margin-bottom:1rem; font-size:1rem; }
        input:focus { outline:none; border-color:#16a085; box-shadow:0 0 8px #16a08550; }
        .btn { width:100%; padding:0.8rem; border:none; border-radius:8px; background-color:#16a085; color:#fff; font-weight:bold; cursor:pointer; transition:0.3s; }
        .btn:hover { background-color:#138d75; transform:scale(1.03); }
      `}</style>
      <style>{`
        :root {
          --card-bg: rgba(255,255,255,0.85);
          --primary-color: #2c3e50;
          --accent-color: #16a085;
          --text-color: #1f2937;
          --shadow-color: rgba(0,0,0,0.1);
          --transition-speed: 0.3s;
          --warning-red: #f87171;
          --note-yellow: #facc15;
        }

        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #f0f4f8;
          overflow-x: hidden;
          position: relative;
          color: var(--text-color);
        }

        main {
          padding: 2rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .animate-fadeUp {
          animation: fadeUp 0.6s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .floating-icon {
          position: absolute;
          font-size: 2.5rem;
          opacity: 0.35;
          color: var(--accent-color);
          text-shadow: 0 0 8px rgba(22,160,133,0.7);
          animation: float 18s linear infinite;
        }

        @keyframes float {
          0% { transform: translateY(100vh) translateX(0); }
          50% { transform: translateY(50vh) translateX(30px); }
          100% { transform: translateY(-10vh) translateX(-30px); }
        }

        .site-card {
          background-color: var(--card-bg);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 6px 20px var(--shadow-color);
          transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
          margin-bottom: 2rem;
        }

        .site-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 24px var(--shadow-color);
        }

        .site-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          transition: border var(--transition-speed), box-shadow var(--transition-speed);
        }

        .site-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 12px var(--accent-color);
        }

        .site-btn {
          background-color: var(--accent-color);
          color: #fff;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          font-size: 1rem;
          width: 100%;
          transition: transform var(--transition-speed), background-color var(--transition-speed), box-shadow var(--transition-speed);
        }

        .site-btn:hover {
          background-color: #138d75;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .warning {
          background-color: #fef3c7;
          color: #92400e;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .note {
          background-color: #d1fae5;
          color: #065f46;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .strength-bar {
          height: 8px;
          width: 100%;
          background-color: #e5e7eb;
          border-radius: 8px;
          margin-bottom: 0.25rem;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          width: 0%;
          border-radius: 8px;
          transition: width 0.5s ease, background-color 0.5s ease;
        }

        .strength-label {
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          font-weight: bold;
          color: #374151;
        }

        .master-key-label {
          font-size: 0.95rem;
          margin: 0.25rem 0;
          font-weight: bold;
          color: #374151;
        }
      `}</style>

    </>
  );
}
