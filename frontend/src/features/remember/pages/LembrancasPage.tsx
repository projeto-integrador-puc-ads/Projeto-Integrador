import React, { useEffect, useRef, useState } from "react";
import { getLembrancas } from "../api/remember";
import type { Lembranca } from "../types/remember";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MicIcon from "@mui/icons-material/Mic";

const LembrancasPage: React.FC = () => {
  const [lembrancas, setLembrancas] = useState<Lembranca[]>([]);
  const [titulo, setTitulo] = useState("");
  const [historia, setHistoria] = useState("");
  const [gravando, setGravando] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [data, setData] = useState("");
  const [pessoas, setPessoas] = useState("");
  const [imagens, setImagens] = useState<File[]>([]);
  const [previewImagens, setPreviewImagens] = useState<string[]>([]);

  useEffect(() => {
    getLembrancas().then((res) => setLembrancas(res.data));
  }, []);

  const handleAudio = () => {
    // Web Speech API (simplificado, igual diário)
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.lang = "pt-BR";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: any) => {
        const texto = event.results[0][0].transcript;
        setHistoria((prev) => prev + (prev ? "\n" : "") + texto);
      };
      recognitionRef.current.onend = () => setGravando(false);
    }
    if (!gravando) {
      setGravando(true);
      recognitionRef.current.start();
    } else {
      setGravando(false);
      recognitionRef.current.stop();
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImagens(files);
      setPreviewImagens(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Enviar para backend (integração na próxima etapa)
    alert("Lembrança cadastrada! (integração backend na próxima etapa)");
    setTitulo("");
    setHistoria("");
    setData("");
    setPessoas("");
    setImagens([]);
    setPreviewImagens([]);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Lembranças</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fffbe9",
          borderRadius: 16,
          boxShadow: "0 2px 12px #ffe0b2",
          padding: 24,
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título da lembrança"
            style={{
              fontSize: 20,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ffd54f",
            }}
            
            required
            
          />
          <textarea
            value={historia}
            onChange={(e) => setHistoria(e.target.value)}
            placeholder="Conte sua lembrança..."
            rows={5}
            style={{
              fontSize: 18,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ffd54f",
              resize: "vertical",
            }}
            required
          />
          <button
            type="button"
            onClick={handleAudio}
            style={{
              alignSelf: "flex-start",
              background: gravando ? "#ff9800" : "#fffde7",
              color: "#ff9800",
              border: "none",
              borderRadius: 50,
              padding: 10,
              cursor: "pointer",
              boxShadow: gravando ? "0 0 8px #ff9800" : "none",
            }}
          >
            <MicIcon sx={{ fontSize: 28 }} />{" "}
            {gravando ? "Gravando..." : "Gravar áudio"}
          </button>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            style={{
              fontSize: 16,
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ffd54f",
              width: "fit-content",
            }}
            required
          />
          <input
            type="text"
            value={pessoas}
            onChange={(e) => setPessoas(e.target.value)}
            placeholder="Pessoas envolvidas (separe por vírgula)"
            style={{
              fontSize: 16,
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ffd54f",
            }}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              color: "#ff9800",
            }}
          >
            <PhotoCameraIcon /> Anexar imagens
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImagemChange}
            />
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {previewImagens.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="preview"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #ffd54f",
                }}
              />
            ))}
          </div>
          <button
            type="submit"
            style={{
              background: "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontSize: 18,
              fontWeight: 700,
              marginTop: 8,
              cursor: "pointer",
              boxShadow: "0 2px 8px #ffd54f",
            }}
          >
            Salvar lembrança
          </button>
        </div>
      </form>
      <h2 style={{ marginBottom: 12 }}>Minhas lembranças</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {lembrancas.map((l) => (
          <li
            key={l.id}
            style={{
              marginBottom: 16,
              background: "#fffde7",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 6px #ffe082",
            }}
          >
            <strong>{l.titulo}</strong> - {l.data}
            <p>{l.descricao || l.historia}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LembrancasPage;
