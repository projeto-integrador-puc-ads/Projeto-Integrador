import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

// importe sua página do módulo Eldercare
import QuestionarioDemo from "./features/eldercare/QuestionarioDemo";

function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Plataforma de Auxílio ao Idoso</h1>
      <p>Bem-vindo(a)! Selecione um módulo abaixo.</p>

      <div style={{ marginTop: 24 }}>
        <Link
          to="/eldercare/questionario"
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            display: "inline-block",
            border: "1px solid #ddd",
            textDecoration: "none",
          }}
        >
          🧩 Eldercare — Questionário e Plano
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/eldercare/questionario" element={<QuestionarioDemo />} />
        {/* fallback pra qualquer rota desconhecida */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
