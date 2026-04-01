import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <style>{`
        :root {
          --card-bg: rgba(255,255,255,0.85);
          --primary-color: #2c3e50;
          --accent-color: #16a085;
          --text-color: #1f2937;
          --shadow-color: rgba(0,0,0,0.1);
          --transition-speed: 0.3s;
        }

        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #f0f4f8;
          overflow-x: hidden;
          position: relative;
          color: var(--text-color);
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

        h2, h3 {
          color: var(--primary-color);
        }

        p {
          line-height: 1.6;
        }

        .warning {
          background-color: #fef3c7;
          color: #92400e;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin: 0.75rem 0;
          font-weight: bold;
        }

        .note {
          background-color: #d1fae5;
          color: #065f46;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin: 0.75rem 0;
          font-weight: bold;
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

        .site-btn {
          background-color: var(--accent-color);
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: transform var(--transition-speed), background-color var(--transition-speed), box-shadow var(--transition-speed);
          text-decoration: none;
        }

        .site-btn:hover {
          background-color: #138d75;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .feature-video-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: start;
          margin-bottom: 2.5rem;
        }

        @media (min-width: 768px) {
          .feature-video-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .feature-video {
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 6px 20px var(--shadow-color);
        }

        .feature-list {
          list-style-type: disc;
          padding-left: 1.5rem;
        }

        .feature-list li {
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          border-radius: 6px;
          transition: transform var(--transition-speed), background-color var(--transition-speed);
        }

        .feature-list li:hover {
          transform: translateX(6px);
          background-color: #e0f7fa;
        }

        .info-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        @media (min-width: 768px) {
          .info-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .info-card {
          background-color: var(--card-bg);
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 16px var(--shadow-color);
          transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
        }

        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px var(--shadow-color);
        }

        .info-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          display: inline-block;
          color: var(--accent-color);
        }
      `}</style>

      {/* Floating icons */}
      <span className="floating-icon" style={{top:"20%", left:"10%"}}>✔️</span>
      <span className="floating-icon" style={{top:"60%", left:"30%"}}>🔒</span>
      <span className="floating-icon" style={{top:"40%", left:"70%"}}>🔑</span>
      <span className="floating-icon" style={{top:"80%", left:"50%"}}>✔️</span>
      <span className="floating-icon" style={{top:"10%", left:"80%"}}>🔒</span>

      <main className="animate-fadeUp">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Secure File Encryption System
          </h2>
          <p className="max-w-2xl mx-auto mb-4">
            Encrypt and decrypt PDF & image (png, jpg, jpeg) files using AES encryption, password protection, attempt lock, and master key recovery.
          </p>
          <div className="warning">
            ⚠️ Multiple incorrect password attempts will lock the file temporarily.
          </div>
          <div className="note">
            💡 User master key recovery is available for authorized access.
          </div>
        </section>

        {/* Info Section */}
        <section className="info-grid mb-12">
          <div className="info-card">
            <div className="info-icon">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Confidentiality</h3>
            <p>Keep your sensitive documents safe from unauthorized access.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Integrity</h3>
            <p>Ensure files are not tampered with and remain original.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Controlled Access</h3>
            <p>Only users with correct credentials can decrypt and access files.</p>
          </div>
        </section>

        {/* Features & Video */}
        <section className="feature-video-grid mb-12">
          <div>
            <div className="site-card mb-6">
              <h3 className="text-2xl font-semibold mb-4">🔐 Encrypt Files</h3>
              <p className="mb-6">
                Protect your confidential files with strong password-based encryption. Passwords are securely hashed before storage.
              </p>
              <Link to="/encrypt" className="site-btn inline-block">
                Start Encryption
              </Link>
            </div>

            <div className="site-card">
              <h3 className="text-2xl font-semibold mb-4">🔓 Decrypt Files</h3>
              <p className="mb-6">
                Safely decrypt encrypted files using the correct password. Attempt tracking prevents unauthorized access.
              </p>
              <Link to="/decrypt" className="site-btn inline-block">
                Start Decryption
              </Link>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
            <video
              className="feature-video"
              controls
              src="/videos/1.mp4"
            >
              Your browser does not support the video tag.
            </video>

            {/* System Features Dropdown BELOW video */}
            <div className="site-card mt-6">
              <button
                className="site-btn w-full text-left"
                onClick={() => {
                  const list = document.getElementById("feature-list");
                  if (list) list.style.display = list.style.display === "none" ? "block" : "none";
                }}
              >
                Show/Hide Features ▼
              </button>

              <ul id="feature-list" className="feature-list mt-4" style={{ display: "none" }}>
                <li>Study common security issues related to PDF & image files.</li>
                <li>Analyze existing encryption tools & their limitations.</li>
                <li>Implement encryption/decryption with AES security.</li>
                <li>Password protection with secure JSON storage.</li>
                <li>Attempt lock mechanism after multiple failed password attempts.</li>
                <li>Track incorrect password attempts per file.</li>
                <li>Master key recovery via mail.</li>
                <li>Design a user-friendly interface for file selection & password input.</li>
                <li>Visual animations demonstrate encryption/decryption processes.</li>
                <li>Enhanced security ensures confidentiality, integrity, and controlled access.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
