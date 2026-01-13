import { useState } from "react";
import LoginPage from "./LoginPage";
import AccountPage from "./RegisterPage";
import logo from "../../assets/react.svg";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      {/* --- LOGO --- */}
      <div className="mb-3 d-flex justify-content-center">
        <img
          src={logo}
          alt="Logo App"
          style={{ width: "120px" }}
        />
      </div>
      {/* --- CARD --- */}
      <div className="card p-4 shadow w-100" style={{ maxWidth: "500px" }}>
        {/* --- TABS --- */}
        <div className="d-flex justify-content-around mb-4">
          <button
            className={`btn btn-link text-decoration-none auth-tab ${
              activeTab === "login" ? "active" : ""
            }`}
            onClick={() => setActiveTab("login")}
          >
            Iniciar sesión
          </button>

          <button
            className={`btn btn-link text-decoration-none auth-tab ${
              activeTab === "register" ? "active" : ""
            }`}
            onClick={() => setActiveTab("register")}
          >
            Registrarse
          </button>
        </div>

        {/* --- FORMULARIOS --- */}
        {activeTab === "login" ? <LoginPage /> : <AccountPage />}
      </div>
    </div>
  );
}
