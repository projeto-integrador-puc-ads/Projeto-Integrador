import React, { useEffect, useState } from "react";
import { getDiarios, postDiario } from "../api/remember";
import type { Diario } from "../types/remember";

const DiariosPage: React.FC = () => {
  const [diarios, setDiarios] = useState<Diario[]>([]);
  const [nota, setNota] = useState("");
  const [gravando, setGravando] = useState(false);
  const [erroAudio, setErroAudio] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  // Simulação: ID do usuário (ajuste para pegar do contexto de autenticação)
  const identificadorUsuario = 1;
  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitulo(e.target.value);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErroSalvar(null);
    try {
      await postDiario({ titulo, conteudo: nota, identificadorUsuario });
      setTitulo("");
      setNota("");
      // Atualiza lista após salvar
      const res = await getDiarios();
      setDiarios(res.data);
    } catch (err: any) {
      setErroSalvar("Erro ao salvar diário. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };
  // @ts-expect-error: SpeechRecognition pode não estar disponível em todos navegadores
  const recognitionRef = React.useRef<any>(null);

  // Função para iniciar/parar gravação e transcrição
  const handleGravarAudio = () => {
    setErroAudio(null);
    // @ts-expect-error
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setErroAudio(
        "Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge."
      );
      return;
    }
    if (!recognitionRef.current) {
      // @ts-expect-error
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.lang = "pt-BR";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: any) => {
        const texto = event.results[0][0].transcript;
        setNota((prev) => prev + (prev ? "\n" : "") + texto);
      };
      recognitionRef.current.onerror = (event: any) => {
        setErroAudio("Erro ao capturar áudio: " + event.error);
        setGravando(false);
      };
      recognitionRef.current.onend = () => {
        setGravando(false);
      };
    }
    if (!gravando) {
      setGravando(true);
      recognitionRef.current.start();
    } else {
      setGravando(false);
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {
    getDiarios().then((res) => setDiarios(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNota(e.target.value);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h1>Diário</h1>
      <form onSubmit={handleSalvar} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={titulo}
          onChange={handleTituloChange}
          placeholder="Título da anotação"
          style={{
            width: "100%",
            fontSize: 18,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 8,
          }}
          required
        />
        <textarea
          value={nota}
          onChange={handleChange}
          rows={6}
          placeholder="Escreva aqui sua anotação do dia..."
          style={{
            width: "100%",
            fontSize: 18,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 8,
          }}
          required
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <button
            type="button"
            onClick={handleGravarAudio}
            style={{
              background: gravando ? "#c62828" : "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {gravando ? "Parar gravação" : "Gravar áudio"}
          </button>
          <button
            type="submit"
            disabled={salvando}
            style={{
              background: salvando ? "#aaa" : "#388e3c",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontSize: 16,
              cursor: salvando ? "not-allowed" : "pointer",
            }}
          >
            {salvando ? "Salvando..." : "Salvar anotação"}
          </button>
        </div>
        {erroAudio && (
          <div style={{ color: "red", marginBottom: 8 }}>{erroAudio}</div>
        )}
        {erroSalvar && (
          <div style={{ color: "red", marginBottom: 8 }}>{erroSalvar}</div>
        )}
      </form>
      {/* Lista de anotações antigas */}
      <h2 style={{ fontSize: "1.2rem", marginTop: 32 }}>
        Anotações anteriores
      </h2>
      <ul>
        {diarios.map((d) => (
          <li key={d.id}>
            <strong>{d.titulo}</strong> - {d.data}
            <p>{d.conteudo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiariosPage;
