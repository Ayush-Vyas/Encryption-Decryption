export default function Footer() {
  return (
    <>
      {/* Internal CSS */}
      <style>{`
        footer {
          border-top: 1px solid rgba(4, 120, 87, 0.3);
          margin-top: 5rem;
          background-color: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
        }

        .footer-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem;
          text-align: center;
          color: #cbd5e1; /* gray-400 */
          font-size: 0.875rem; /* text-sm */
          line-height: 1.5rem;
          transition: color 0.3s ease;
        }

        .footer-container a {
          color: #4caf50;
          text-decoration: none;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .footer-container a:hover {
          color: #388e3c;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>

      <footer>
        <div className="footer-container">
          © 2025 Secure File Encryption System  
          <br />
          Developed by <span>Aarchi Patel</span> & <span>Ayush Vyas</span>
        </div>
      </footer>
    </>
  );
}
