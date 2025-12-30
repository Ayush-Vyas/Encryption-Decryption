import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Encrypt from "./pages/Encrypt";
import Decrypt from "./pages/Decrypt";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      {/* Internal CSS */}
      <style>{`
        :root {
          --green-light: #a8e6cf;
          --green: #4caf50;
          --green-dark: #388e3c;
          --white: #ffffff;
          --shadow-green: rgba(76, 175, 80, 0.4);
          --transition-speed: 0.3s;
        }

        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          background-color: var(--green-light);
        }

        main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
        }

        /* Box styles */
        .box {
          background-color: var(--white);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 4px 12px var(--shadow-green);
          transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
        }

        .box:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 10px 20px var(--shadow-green);
        }

        /* Button styles */
        .btn {
          background-color: var(--green);
          color: var(--white);
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: transform var(--transition-speed), background-color var(--transition-speed), box-shadow var(--transition-speed);
        }

        .btn:hover {
          background-color: var(--green-dark);
          transform: scale(1.05);
          box-shadow: 0 4px 12px var(--shadow-green);
        }

        /* Fade-in animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.6s ease forwards;
        }

        /* Gradient hover box */
        .gradient-hover {
          background: linear-gradient(135deg, var(--green-light), var(--green));
          color: var(--white);
          border-radius: 12px;
          padding: 20px;
          transition: background 0.5s ease, transform 0.3s ease;
        }

        .gradient-hover:hover {
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          transform: scale(1.05);
        }

        /* Heading & paragraph */
        h2 {
          color: var(--green-dark);
          margin-bottom: 10px;
        }

        p {
          color: #333;
        }

      `}</style>

      {/* Header */}
      <Header />

      {/* Main content wrapper */}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <div className="w-full max-w-5xl fade-in">
                <Home />
              </div>
            }
          />
          <Route
            path="/encrypt"
            element={
              <div className="w-full max-w-5xl fade-in">
                <Encrypt />
              </div>
            }
          />
          <Route
            path="/decrypt"
            element={
              <div className="w-full max-w-5xl fade-in">
                <Decrypt />
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}
