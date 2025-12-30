import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const handleClick = (link: string) => {
    setActiveLink(link);
    setTimeout(() => setActiveLink(null), 1200); // reset animation after 1.2s
  };

  return (
    <>
      <style>{`
        header {
          position: sticky;
          top: 0;
          z-index: 50;
          background-color: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(22,160,133,0.3);
          padding: 1rem 0;
        }

        .header-container {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.5rem;
        }

        .site-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #16a085;
        }

        nav {
          display: flex;
          gap: 1rem;
        }

        .nav-button {
          position: relative;
          padding: 0.5rem 1rem 0.5rem 2rem;
          border: none;
          border-radius: 8px;
          background-color: #16a085;
          color: #fff;
          font-weight: 500;
          cursor: pointer;
          font-size: 1rem;
          transition: transform 0.2s ease, background-color 0.3s ease;
          overflow: hidden;
        }

        .nav-button:hover {
          transform: scale(1.05);
          background-color: #1abc9c;
        }

        /* Lock icon using CSS */
        .lock-icon {
          position: absolute;
          left: 0.5rem;
          top: 50%;
          width: 14px;
          height: 20px;
          transform: translateY(-50%);
        }

        .lock-body {
          width: 14px;
          height: 14px;
          background-color: #fff;
          border-radius: 2px;
          position: absolute;
          bottom: 0;
        }

        .lock-shackle {
          width: 10px;
          height: 8px;
          border: 2px solid #fff;
          border-bottom: none;
          border-radius: 5px 5px 0 0;
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%) rotate(0deg);
          transform-origin: bottom center;
          transition: transform 0.6s ease;
        }

        .unlock {
          transform: translateX(-50%) rotate(-45deg);
        }

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 0.75rem;
          }

          nav {
            gap: 0.75rem;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>

      <header>
        <div className="header-container">
          <h1 className="site-title">Secure Encrypt</h1>

          <nav>
            {["Home", "Encrypt", "Decrypt"].map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                style={{ textDecoration: "none" }}
                onClick={() => handleClick(link)}
              >
                <button className="nav-button">
                  <span className={`lock-icon`}>
                    <span
                      className={`lock-shackle ${activeLink === link ? "unlock" : ""}`}
                    ></span>
                    <span className="lock-body"></span>
                  </span>
                  {link}
                </button>
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
