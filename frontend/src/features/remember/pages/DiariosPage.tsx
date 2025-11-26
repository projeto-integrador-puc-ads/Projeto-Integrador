import React, { useEffect, useState, useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import LembrancasPage from "./LembrancasPage";
import ConquistasPageAdmin from "./ConquistasPage";
import ConquistasUsuarioPage from "./ConquistasUsuarioPage";

import { getDiarios, postDiario } from "../api/remember";
import type { Diario } from "../types/remember";

// Declaração global para SpeechRecognition (caso não exista no escopo)
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

const DiariosPage: React.FC = () => {
    const [openLembranca, setOpenLembranca] = useState(false);
    // Renomeado para ficar claro que é a visão do usuário
    const [openUserConquistas, setOpenUserConquistas] = useState(false);
    // Novo estado para o modal de administração
    const [openAdminConquistas, setOpenAdminConquistas] = useState(false);

    // --- (Lógica de Áudio e Diários mantida igual ao seu código original) ---
    // ... (omiti para economizar espaço, mantenha todo o seu código de speech recognition e handlers aqui) ...
    const [gravandoTitulo, setGravandoTitulo] = useState(false);
    const [erroAudioTitulo, setErroAudioTitulo] = useState<string | null>(null);
    const recognitionTituloRef = useRef<SpeechRecognition | null>(null);
    const handleGravarAudioTitulo = () => {
        // (Sua lógica existente...)
        setErroAudioTitulo(null);
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionClass) { setErroAudioTitulo("Seu navegador não suporta reconhecimento de voz."); return; }
        if (!recognitionTituloRef.current) {
            recognitionTituloRef.current = new SpeechRecognitionClass();
            recognitionTituloRef.current.lang = "pt-BR";
            recognitionTituloRef.current.continuous = false;
            recognitionTituloRef.current.interimResults = false;
            recognitionTituloRef.current.onresult = (event: SpeechRecognitionEventType) => {
                const texto = event.results[0][0].transcript;
                setDiarios((prev) => { const novos = ensurePagina([...prev], paginaAtual); novos[paginaAtual].titulo += (novos[paginaAtual].titulo ? " " : "") + texto; return novos; });
            };
            recognitionTituloRef.current.onerror = (event: SpeechRecognitionEventType) => { setErroAudioTitulo("Erro: " + (event.error || "")); setGravandoTitulo(false); };
            recognitionTituloRef.current.onend = () => { setGravandoTitulo(false); };
        }
        if (!gravandoTitulo) { setGravandoTitulo(true); recognitionTituloRef.current.start(); } else { setGravandoTitulo(false); recognitionTituloRef.current.stop(); }
    };
    const [diarios, setDiarios] = useState<Diario[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [gravando, setGravando] = useState(false);
    const [erroAudio, setErroAudio] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [erroSalvar, setErroSalvar] = useState<string | null>(null);
    const identificadorUsuario = 1;
    const ensurePagina = (arr: Diario[], idx: number): Diario[] => { if (!arr[idx]) { return [...arr, { id: Date.now(), titulo: "", conteudo: "", data: "" }]; } return arr; };
    const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => { const value = e.target.value; setDiarios((prev) => { const novos = ensurePagina([...prev], paginaAtual); novos[paginaAtual].titulo = value; return novos; }); };
    const handleNotaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { const value = e.target.value; setDiarios((prev) => { const novos = ensurePagina([...prev], paginaAtual); novos[paginaAtual].conteudo = value; return novos; }); };
    const handleSalvar = async (e: React.FormEvent) => { e.preventDefault(); setSalvando(true); setErroSalvar(null); const pagina = diarios[paginaAtual]; try { if (pagina.titulo.trim() || pagina.conteudo.trim()) { await postDiario({ titulo: pagina.titulo, conteudo: pagina.conteudo, identificadorUsuario, }); const res = await getDiarios(); setDiarios(res.data); } } catch { setErroSalvar("Erro ao salvar diário."); } finally { setSalvando(false); } };
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const handleGravarAudio = () => {
        // (Sua lógica existente...)
        setErroAudio(null); const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionClass) { setErroAudio("Navegador sem suporte a voz."); return; }
        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognitionClass(); recognitionRef.current.lang = "pt-BR"; recognitionRef.current.continuous = false; recognitionRef.current.interimResults = false;
            recognitionRef.current.onresult = (event: SpeechRecognitionEventType) => { const texto = event.results[0][0].transcript; setDiarios((prev) => { const novos = ensurePagina([...prev], paginaAtual); novos[paginaAtual].conteudo += (novos[paginaAtual].conteudo ? "\n" : "") + texto; return novos; }); };
            recognitionRef.current.onerror = (event: SpeechRecognitionEventType) => { setErroAudio("Erro: " + (event.error || "")); setGravando(false); }; recognitionRef.current.onend = () => { setGravando(false); };
        }
        if (!gravando) { setGravando(true); recognitionRef.current.start(); } else { setGravando(false); recognitionRef.current.stop(); }
    };
    // -----------------------------------------------------------------------

    useEffect(() => {
        getDiarios().then((res) => setDiarios(res.data));
    }, []);


    // Estilo comum para os modais
    const modalOverlayStyle: React.CSSProperties = {
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: 'blur(3px)'
    };
    const modalCloseButtonStyle: React.CSSProperties = {
        position: "absolute", top: 12, right: 12, background: "#fff", color: "#555", border: "1px solid #ccc", borderRadius: "50%", width: 36, height: 36, fontSize: 22, fontWeight: 700, cursor: "pointer", zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
    };


    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>

            {/* --- NOVO: Área superior direita para o botão de Admin --- */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <button
                    onClick={() => setOpenAdminConquistas(true)}
                    title="Gerenciar Conquistas (Administrador)"
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#757575",
                        cursor: "pointer",
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <ManageAccountsIcon sx={{ fontSize: 24 }} />
                </button>
            </div>

            {/* Cabeçalho principal e botões do usuário */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                }}
            >
                <h1 style={{ margin: 0, color: '#1976d2' }}>Memória</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setOpenLembranca(true)}
                        style={{
                            display: "flex", alignItems: "center", gap: 8, background: "#ff9800", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 600, fontSize: 16, boxShadow: "0 4px 6px rgba(255, 152, 0, 0.3)", cursor: "pointer", transition: "transform 0.1s",
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <PhotoAlbumIcon sx={{ fontSize: 24 }} /> Lembranças
                    </button>
                    <button
                        onClick={() => setOpenUserConquistas(true)} // Abre a visão do usuário agora
                        style={{
                            display: "flex", alignItems: "center", gap: 8, background: "#4caf50", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 600, fontSize: 16, boxShadow: "0 4px 6px rgba(76, 175, 80, 0.3)", cursor: "pointer", transition: "transform 0.1s",
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <EmojiEventsIcon sx={{ fontSize: 24 }} /> Conquistas
                    </button>
                </div>
            </div>


            {/* --- MODAIS --- */}

            {/* 1. Modal de Lembranças */}
            {openLembranca && (
                <div style={modalOverlayStyle}>
                    <div style={{ position: "relative", width: "95%", maxWidth: 640, background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <button onClick={() => setOpenLembranca(false)} style={modalCloseButtonStyle}>×</button>
                        <div style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                            <LembrancasPage />
                        </div>
                    </div>
                </div>
            )}

            {/* 2. NOVO: Modal de Conquistas do USUÁRIO (Renderiza o novo componente placeholder) */}
            {openUserConquistas && (
                <div style={modalOverlayStyle}>
                    <div style={{ position: "relative", width: "95%", maxWidth: 600, background: '#f9f9f9', borderRadius: 18, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <button onClick={() => setOpenUserConquistas(false)} style={modalCloseButtonStyle}>×</button>
                        {/* Renderiza o componente de visão do usuário */}
                        <ConquistasUsuarioPage />
                    </div>
                </div>
            )}

            {/* 3. NOVO: Modal de Gerenciamento ADMIN (Renderiza a tabela antiga) */}
            {openAdminConquistas && (
                <div style={modalOverlayStyle}>
                    {/* Este modal é mais largo para caber a tabela de admin */}
                    <div style={{ position: "relative", width: "95%", maxWidth: 1000, background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <button onClick={() => setOpenAdminConquistas(false)} style={modalCloseButtonStyle}>×</button>
                        <div style={{ padding: '20px', maxHeight: '85vh', overflowY: 'auto' }}>
                            {/* Renderiza a página administrativa (ConquistasPage.tsx) */}
                            <ConquistasPageAdmin />
                        </div>
                    </div>
                </div>
            )}


            {/* --- Restante do conteúdo da página Diários (Formulário) --- */}
            <h2 style={{ fontSize: 22, marginBottom: 16, color: "#555" }}>
                Meu Diário
            </h2>
            <form onSubmit={handleSalvar} style={{ marginBottom: 24 }}>
                {/* ... (Mantive o seu código do formulário exatamente igual aqui) ... */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input type="text" value={diarios[paginaAtual]?.titulo || ""} onChange={handleTituloChange} placeholder="Título da página" style={{ flex: 1, fontSize: 22, padding: 12, borderRadius: 8, border: "1px solid #bbb", background: "#f9f7f3", fontWeight: 600 }} required />
                    <button type="button" onClick={handleGravarAudioTitulo} style={{ background: gravandoTitulo ? "#c62828" : "#1976d2", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: gravandoTitulo ? "0 0 0 2px #c62828" : "0 0 0 1px #1976d2", transition: "background 0.2s", color: "#fff", outline: "none" }} aria-label={gravandoTitulo ? "Parar gravação do título" : "Gravar título por voz"}> <MicIcon style={{ fontSize: 24 }} /> </button>
                </div>
                {erroAudioTitulo && ( <div style={{ color: "red", marginBottom: 8 }}>{erroAudioTitulo}</div> )}
                <div style={{ width: "100%", minHeight: 340, background: "#f9f7f3", borderRadius: 16, border: "2px solid #bdbdbd", boxShadow: "0 2px 12px #0001", marginBottom: 12, padding: 0, position: "relative", overflow: "hidden" }}>
                    <textarea value={diarios[paginaAtual]?.conteudo || ""} onChange={handleNotaChange} rows={14} placeholder="Escreva aqui sua anotação do dia..." style={{ width: "100%", height: 340, fontSize: 18, padding: 32, border: "none", background: "transparent", resize: "none", outline: "none", fontFamily: "serif", lineHeight: 2.2, letterSpacing: 0.5, color: "#333", boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 30px, #e0e0e0 31px)" }} required />
                    <button type="button" onClick={handleGravarAudio} style={{ position: "absolute", bottom: 16, right: 16, background: gravando ? "#c62828" : "#1976d2", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: gravando ? "0 0 0 2px #c62828" : "0 0 0 1px #1976d2", color: "#fff", outline: "none", zIndex: 2 }} aria-label={gravando ? "Parar gravação do conteúdo" : "Gravar conteúdo por voz"}> <MicIcon style={{ fontSize: 28 }} /> </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <button type="button" onClick={() => setPaginaAtual((p) => Math.max(0, p - 1))} disabled={paginaAtual === 0} style={{ background: "#eee", border: "1px solid #bbb", borderRadius: 8, padding: "6px 18px", fontSize: 16, cursor: paginaAtual === 0 ? "not-allowed" : "pointer", color: "#555" }}> Página anterior </button>
                    <span style={{ fontWeight: 600, fontSize: 18 }}> Página {paginaAtual + 1} </span>
                    <button type="button" onClick={() => setPaginaAtual((p) => Math.min(diarios.length - 1, p + 1))} disabled={paginaAtual >= diarios.length - 1} style={{ background: "#eee", border: "1px solid #bbb", borderRadius: 8, padding: "6px 18px", fontSize: 16, cursor: paginaAtual >= diarios.length - 1 ? "not-allowed" : "pointer", color: "#555" }}> Próxima página </button>
                </div>
                <button type="submit" disabled={salvando} style={{ background: salvando ? "#aaa" : "#388e3c", color: "#fff", border: "none", borderRadius: 8, padding: "10px 32px", fontSize: 18, cursor: salvando ? "not-allowed" : "pointer", margin: "0 auto", display: "block", marginTop: 12 }}> {salvando ? "Salvando..." : "Salvar página do diário"} </button>
                {erroAudio && ( <div style={{ color: "red", marginBottom: 8 }}>{erroAudio}</div> )}
                {erroSalvar && ( <div style={{ color: "red", marginBottom: 8 }}>{erroSalvar}</div> )}
            </form>

            {/* Lista de anotações antigas */}
            <h2 style={{ fontSize: "1.2rem", marginTop: 32, color: '#555' }}>
                Anotações anteriores
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {diarios.map((d) => (
                    <li key={d.id} style={{ background: '#fff', marginBottom: 12, padding: 16, borderRadius: 12, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <strong style={{ fontSize: '1.1rem', color: '#1976d2' }}>{d.titulo}</strong>
                            <small style={{ color: '#888' }}>{d.data}</small>
                        </div>
                        <p style={{ margin: 0, color: '#333', lineHeight: 1.6 }}>{d.conteudo ? d.conteudo.substring(0, 100) + (d.conteudo.length > 100 ? '...' : '') : 'Sem conteúdo.'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DiariosPage;