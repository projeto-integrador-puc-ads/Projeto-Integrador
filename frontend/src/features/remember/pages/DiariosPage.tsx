import React, { useEffect, useState, useRef } from "react";

// Declaração global para SpeechRecognition (caso não exista no escopo)
// Usando 'any' para compatibilidade cross-browser e evitar erros de tipo em navegadores sem suporte
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognition = any;
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognition;
    webkitSpeechRecognition: SpeechRecognition;
  }
}

type SpeechRecognitionEventType = {
  results: SpeechRecognitionResultList;
  error?: string;
};
import MicIcon from "@mui/icons-material/Mic";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import LembrancasPage from "./LembrancasPage";
import { getDiarios, postDiario } from "../api/remember";
import type { Diario } from "../types/remember";

const DiariosPage: React.FC = () => {
  const [openLembranca, setOpenLembranca] = useState(false);
  // Áudio para título
  const [gravandoTitulo, setGravandoTitulo] = useState(false);
  const [erroAudioTitulo, setErroAudioTitulo] = useState<string | null>(null);
  const recognitionTituloRef = useRef<SpeechRecognition | null>(null);
  const handleGravarAudioTitulo = () => {
    setErroAudioTitulo(null);
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setErroAudioTitulo(
        "Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge."
      );
      return;
    }
    if (!recognitionTituloRef.current) {
      recognitionTituloRef.current = new SpeechRecognitionClass();
      recognitionTituloRef.current.lang = "pt-BR";
      recognitionTituloRef.current.continuous = false;
      recognitionTituloRef.current.interimResults = false;
      recognitionTituloRef.current.onresult = (
        event: SpeechRecognitionEventType
      ) => {
        const texto = event.results[0][0].transcript;
        setDiarios((prev) => {
          const novos = ensurePagina([...prev], paginaAtual);
          novos[paginaAtual].titulo +=
            (novos[paginaAtual].titulo ? " " : "") + texto;
          return novos;
        });
      };
      recognitionTituloRef.current.onerror = (
        event: SpeechRecognitionEventType
      ) => {
        setErroAudioTitulo("Erro ao capturar áudio: " + (event.error || ""));
        setGravandoTitulo(false);
      };
      recognitionTituloRef.current.onend = () => {
        setGravandoTitulo(false);
      };
    }
    if (!gravandoTitulo) {
      setGravandoTitulo(true);
      recognitionTituloRef.current.start();
    } else {
      setGravandoTitulo(false);
      recognitionTituloRef.current.stop();
    }
  };
  const [diarios, setDiarios] = useState<Diario[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [erroAudio, setErroAudio] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  // Simulação: ID do usuário (ajuste para pegar do contexto de autenticação)
  const identificadorUsuario = 1;
  // Garante que sempre existe uma página válida antes de editar
  const ensurePagina = (arr: Diario[], idx: number): Diario[] => {
    if (!arr[idx]) {
      return [...arr, { id: Date.now(), titulo: "", conteudo: "", data: "" }];
    }
    return arr;
  };

  // Atualiza título e nota da página atual
  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDiarios((prev) => {
      const novos = ensurePagina([...prev], paginaAtual);
      novos[paginaAtual].titulo = value;
      return novos;
    });
  };
  const handleNotaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDiarios((prev) => {
      const novos = ensurePagina([...prev], paginaAtual);
      novos[paginaAtual].conteudo = value;
      return novos;
    });
  };
  // Salva a página atual no backend
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErroSalvar(null);
    const pagina = diarios[paginaAtual];
    try {
      if (pagina.titulo.trim() || pagina.conteudo.trim()) {
        await postDiario({
          titulo: pagina.titulo,
          conteudo: pagina.conteudo,
          identificadorUsuario,
        });
        // Atualiza lista após salvar
        const res = await getDiarios();
        setDiarios(res.data);
      }
    } catch {
      setErroSalvar("Erro ao salvar diário. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };
  // Áudio para conteúdo

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Função para iniciar/parar gravação e transcrição
  const handleGravarAudio = () => {
    setErroAudio(null);
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setErroAudio(
        "Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge."
      );
      return;
    }
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.lang = "pt-BR";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: SpeechRecognitionEventType) => {
        const texto = event.results[0][0].transcript;
        setDiarios((prev) => {
          const novos = ensurePagina([...prev], paginaAtual);
          novos[paginaAtual].conteudo +=
            (novos[paginaAtual].conteudo ? "\n" : "") + texto;
          return novos;
        });
      };
      recognitionRef.current.onerror = (event: SpeechRecognitionEventType) => {
        setErroAudio("Erro ao capturar áudio: " + (event.error || ""));
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

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>Memória</h1>
        <button
          onClick={() => setOpenLembranca(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#ff9800",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: 18,
            boxShadow: "0 2px 8px #ffd54f",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <PhotoAlbumIcon sx={{ fontSize: 28 }} /> Lembranças
        </button>
      </div>
      {openLembranca && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: 640 }}>
            <button
              onClick={() => setOpenLembranca(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#fff3e0",
                color: "#ff9800",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                fontSize: 22,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 1px 4px #ffd54f",
                zIndex: 2,
              }}
              aria-label="Fechar"
            >
              ×
            </button>
            <div style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
              <LembrancasPage />
            </div>
          </div>
        </div>
      )}
      <h2 style={{ fontSize: 22, marginBottom: 16, color: "#1976d2" }}>
        Diário
      </h2>
      <form onSubmit={handleSalvar} style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <input
            type="text"
            value={diarios[paginaAtual]?.titulo || ""}
            onChange={handleTituloChange}
            placeholder="Título da página"
            style={{
              flex: 1,
              fontSize: 22,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #bbb",
              background: "#f9f7f3",
              fontWeight: 600,
            }}
            required
          />
          <button
            type="button"
            onClick={handleGravarAudioTitulo}
            style={{
              background: gravandoTitulo ? "#c62828" : "#1976d2",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: gravandoTitulo
                ? "0 0 0 2px #c62828"
                : "0 0 0 1px #1976d2",
              transition: "background 0.2s",
              color: "#fff",
              outline: "none",
            }}
            aria-label={
              gravandoTitulo
                ? "Parar gravação do título"
                : "Gravar título por voz"
            }
          >
            <MicIcon style={{ fontSize: 24 }} />
          </button>
        </div>
        {erroAudioTitulo && (
          <div style={{ color: "red", marginBottom: 8 }}>{erroAudioTitulo}</div>
        )}
        <div
          style={{
            width: "100%",
            minHeight: 340,
            background: "#f9f7f3",
            borderRadius: 16,
            border: "2px solid #bdbdbd",
            boxShadow: "0 2px 12px #0001",
            marginBottom: 12,
            padding: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <textarea
            value={diarios[paginaAtual]?.conteudo || ""}
            onChange={handleNotaChange}
            rows={14}
            placeholder="Escreva aqui sua anotação do dia..."
            style={{
              width: "100%",
              height: 340,
              fontSize: 18,
              padding: 32,
              border: "none",
              background: "transparent",
              resize: "none",
              outline: "none",
              fontFamily: "serif",
              lineHeight: 2.2,
              letterSpacing: 0.5,
              color: "#333",
              boxSizing: "border-box",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 30px, #e0e0e0 31px)",
            }}
            required
          />
          <button
            type="button"
            onClick={handleGravarAudio}
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              background: gravando ? "#c62828" : "#1976d2",
              border: "none",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: gravando ? "0 0 0 2px #c62828" : "0 0 0 1px #1976d2",
              color: "#fff",
              outline: "none",
              zIndex: 2,
            }}
            aria-label={
              gravando
                ? "Parar gravação do conteúdo"
                : "Gravar conteúdo por voz"
            }
          >
            <MicIcon style={{ fontSize: 28 }} />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <button
            type="button"
            onClick={() => setPaginaAtual((p) => Math.max(0, p - 1))}
            disabled={paginaAtual === 0}
            style={{
              background: "#eee",
              border: "1px solid #bbb",
              borderRadius: 8,
              padding: "6px 18px",
              fontSize: 16,
              cursor: paginaAtual === 0 ? "not-allowed" : "pointer",
              color: "#555",
            }}
          >
            Página anterior
          </button>
          <span style={{ fontWeight: 600, fontSize: 18 }}>
            Página {paginaAtual + 1}
          </span>
          <button
            type="button"
            onClick={() =>
              setPaginaAtual((p) => Math.min(diarios.length - 1, p + 1))
            }
            disabled={paginaAtual >= diarios.length - 1}
            style={{
              background: "#eee",
              border: "1px solid #bbb",
              borderRadius: 8,
              padding: "6px 18px",
              fontSize: 16,
              cursor:
                paginaAtual >= diarios.length - 1 ? "not-allowed" : "pointer",
              color: "#555",
            }}
          >
            Próxima página
          </button>
        </div>
        <button
          type="submit"
          disabled={salvando}
          style={{
            background: salvando ? "#aaa" : "#388e3c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 32px",
            fontSize: 18,
            cursor: salvando ? "not-allowed" : "pointer",
            margin: "0 auto",
            display: "block",
            marginTop: 12,
          }}
        >
          {salvando ? "Salvando..." : "Salvar página do diário"}
        </button>
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
