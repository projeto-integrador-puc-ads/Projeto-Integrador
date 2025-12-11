import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    Typography,
    Button,
    Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import { diariosApi, type CreateDiarioPayload, type UpdateDiarioPayload, type Diario } from '../api/diarios';
import type {Conquista} from '../api/conquistas';

type SpeechRecognition = any;
interface Window {
    SpeechRecognition: SpeechRecognition;
    webkitSpeechRecognition: SpeechRecognition;
}
declare var window: Window;

interface DiarioModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    usuarioId: number;
    diarioParaEditar?: Diario | null;
    // NOVO: Callback para avisar o pai sobre conquistas ganhas
    onConquistaGanhas?: (conquistas: Conquista[]) => void;
}

export default function DiarioModal({ open, onClose, onSuccess, usuarioId, diarioParaEditar, onConquistaGanhas }: DiarioModalProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados de gravação
    const [gravandoTitulo, setGravandoTitulo] = useState(false);
    const [gravandoConteudo, setGravandoConteudo] = useState(false);

    const recognitionTituloRef = useRef<SpeechRecognition | null>(null);
    const recognitionConteudoRef = useRef<SpeechRecognition | null>(null);

    // --- EFEITO: Preenche os dados se for Edição ---
    useEffect(() => {
        if (open) {
            if (diarioParaEditar) {
                setTitulo(diarioParaEditar.titulo);
                setConteudo(diarioParaEditar.conteudo);
            } else {
                setTitulo('');
                setConteudo('');
            }
        }
    }, [open, diarioParaEditar]);

    // --- LÓGICA DE GRAVAÇÃO ---
    const handleGravar = (
        isTitulo: boolean,
        setGravando: React.Dispatch<React.SetStateAction<boolean>>,
        ref: React.MutableRefObject<SpeechRecognition | null>,
        setterTexto: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionClass) {
            enqueueSnackbar("Seu navegador não suporta reconhecimento de voz.", { variant: 'error' });
            return;
        }

        if (!ref.current) {
            ref.current = new SpeechRecognitionClass();
            ref.current.lang = "pt-BR";
            ref.current.continuous = false;
            ref.current.interimResults = false;

            ref.current.onresult = (event: any) => {
                const texto = event.results[0][0].transcript;
                setterTexto((prev) => prev + (prev ? " " : "") + texto);
            };

            ref.current.onerror = () => {
                setGravando(false);
            };

            ref.current.onend = () => {
                setGravando(false);
            };
        }

        if (isTitulo ? gravandoTitulo : gravandoConteudo) {
            ref.current.stop();
            setGravando(false);
        } else {
            ref.current.start();
            setGravando(true);
        }
    };

    // --- SALVAR (Criação ou Edição) ---
    const handleSalvar = async () => {
        if (!titulo.trim() || !conteudo.trim()) {
            enqueueSnackbar('Escreva algo no título ou na história para salvar.', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            let response: Diario;

            if (diarioParaEditar) {
                // --- ATUALIZAR (PUT) ---
                const payload: UpdateDiarioPayload = {
                    titulo,
                    conteudo
                };
                response = await diariosApi.atualizar(diarioParaEditar.identificadorDiario, payload);
                enqueueSnackbar('Diário atualizado com sucesso!', { variant: 'success' });
            } else {
                // --- CRIAR (POST) ---
                const payload: CreateDiarioPayload = {
                    identificadorUsuario: usuarioId,
                    titulo: titulo,
                    conteudo: conteudo,
                    dataEscrita: new Date().toISOString().split('T')[0]
                };
                response = await diariosApi.criar(payload);
                enqueueSnackbar('Diário criado com sucesso!', { variant: 'success' });
            }

            // --- VERIFICAÇÃO DE CONQUISTA ---
            if (response.conquistasDesbloqueadas && response.conquistasDesbloqueadas.length > 0 && onConquistaGanhas) {
                // Chama a função do pai para exibir o modal de festa
                onConquistaGanhas(response.conquistasDesbloqueadas);
            }

            // Limpeza e Fechamento
            if (!diarioParaEditar) {
                setTitulo('');
                setConteudo('');
            }
            onSuccess();
            onClose();

        } catch (error) {
            enqueueSnackbar('Erro ao salvar.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Estilo compartilhado de "Folha de Caderno"
    const cadernoStyle: React.CSSProperties = {
        background: "#f9f7f3",
        backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 39px, #ccc 40px)",
        lineHeight: "40px",
        border: "1px solid #ccc",
        outline: "none",
        color: "#000",
        fontSize: "18px",
        fontFamily: "inherit",
        resize: "none",
        boxSizing: "border-box",
    };

    // Estilo BASE dos botões de áudio
    const audioButtonStyle: React.CSSProperties = {
        background: "#1976d2",
        border: "none",
        borderRadius: "50%",
        width: 52,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        transition: "all 0.2s",
        color: "#fff",
        zIndex: 2,
        outline: "none"
    };

    // Estilo quando está GRAVANDO (Vermelho)
    const audioButtonActiveStyle: React.CSSProperties = {
        ...audioButtonStyle,
        background: "#d32f2f",
        boxShadow: "0 0 0 4px rgba(211, 47, 47, 0.3)",
        transform: "scale(1.05)"
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    p: 1
                }
            }}
        >
            {/* Cabeçalho */}
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" color="primary">
                    {diarioParaEditar ? 'Editar Diário' : 'Novo Diário'}
                </Typography>
                <IconButton onClick={onClose} disabled={loading} size="large">
                    <CloseIcon fontSize="large" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 1 }}>

                {/* --- INPUT DE TÍTULO --- */}
                <Box sx={{ position: 'relative', mb: 3, width: '100%' }}>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título do dia..."
                        disabled={loading}
                        style={{
                            ...cadernoStyle,
                            width: "100%",
                            height: "64px",
                            padding: "10px 80px 10px 16px",
                            borderRadius: "12px",
                        }}
                    />

                    {/* Botão Mic Título */}
                    <button
                        type="button"
                        onClick={() => handleGravar(true, setGravandoTitulo, recognitionTituloRef, setTitulo)}
                        disabled={loading}
                        style={{
                            ...(gravandoTitulo ? audioButtonActiveStyle : audioButtonStyle),
                            position: "absolute",
                            right: 12, // ALINHADO
                            top: "50%",
                            transform: gravandoTitulo ? "translateY(-50%) scale(1.05)" : "translateY(-50%)",
                        }}
                        title="Gravar título"
                    >
                        <MicIcon sx={{ fontSize: 28 }} />
                    </button>
                </Box>

                {/* --- ÁREA DE TEXTO --- */}
                <Box sx={{ position: 'relative', mb: 2, width: '100%' }}>
                    <textarea
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                        disabled={loading}
                        placeholder="Escreva sobre o seu dia aqui..."
                        style={{
                            ...cadernoStyle,
                            width: "100%",
                            height: "400px",
                            padding: "10px 16px 80px 16px",
                            borderRadius: "16px",
                        }}
                    />

                    {/* Botão Mic Conteúdo */}
                    <button
                        type="button"
                        onClick={() => handleGravar(false, setGravandoConteudo, recognitionConteudoRef, setConteudo)}
                        disabled={loading}
                        style={{
                            ...(gravandoConteudo ? audioButtonActiveStyle : audioButtonStyle),
                            position: "absolute",
                            right: 12, // ALINHADO
                            bottom: 16,
                        }}
                        title="Gravar história"
                    >
                        <MicIcon sx={{ fontSize: 28 }} />
                    </button>
                </Box>

                {/* Botão de Salvar */}
                <Stack direction="row" justifyContent="center" pb={2}>
                    <Button
                        onClick={handleSalvar}
                        variant="contained"
                        color="success"
                        size="large"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                        sx={{
                            px: 6,
                            py: 1.5,
                            borderRadius: 3,
                            fontSize: '1.2rem',
                            boxShadow: '0 4px 10px rgba(46, 125, 50, 0.4)'
                        }}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </Stack>

            </DialogContent>
        </Dialog>
    );
}