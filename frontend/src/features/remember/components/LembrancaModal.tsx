import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    Typography,
    Button,
    Stack,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSnackbar } from 'notistack';
import { lembrancasApi, type Lembranca, type CreateLembrancaPayload, type UpdateLembrancaPayload } from '../api/lembrancas';
import type {Conquista} from '../api/conquistas';

// --- Helper Base64 ---
const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

// --- Helper Data Local (CORREÇÃO DO FUSO HORÁRIO) ---
const getHojeLocal = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

// --- Tipagem Audio ---
type SpeechRecognition = any;
interface Window {
    SpeechRecognition: SpeechRecognition;
    webkitSpeechRecognition: SpeechRecognition;
}
declare var window: Window;

interface LembrancaModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    usuarioId: number;
    lembrancaParaEditar?: Lembranca | null;
    onConquistaGanhas?: (conquistas: Conquista[]) => void;
}

export default function LembrancaModal({ open, onClose, onSuccess, usuarioId, lembrancaParaEditar, onConquistaGanhas }: LembrancaModalProps) {
    const { enqueueSnackbar } = useSnackbar();

    // Estados do Formulário
    const [titulo, setTitulo] = useState('');
    const [dataAcontecimento, setDataAcontecimento] = useState('');
    const [local, setLocal] = useState('');
    const [historia, setHistoria] = useState('');

    // Imagem
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Pessoas (Lista Dinâmica)
    const [nomePessoaTemp, setNomePessoaTemp] = useState('');
    const [listaPessoas, setListaPessoas] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);

    // Estados de Gravação
    const [gravandoTitulo, setGravandoTitulo] = useState(false);
    const [gravandoHistoria, setGravandoHistoria] = useState(false);
    const [gravandoLocal, setGravandoLocal] = useState(false);
    const [gravandoPessoas, setGravandoPessoas] = useState(false);

    // Refs de Audio
    const recognitionTituloRef = useRef<SpeechRecognition | null>(null);
    const recognitionHistoriaRef = useRef<SpeechRecognition | null>(null);
    const recognitionLocalRef = useRef<SpeechRecognition | null>(null);
    const recognitionPessoasRef = useRef<SpeechRecognition | null>(null);

    // --- EFEITO: Preencher dados na Edição ---
    useEffect(() => {
        if (open) {
            if (lembrancaParaEditar) {
                setTitulo(lembrancaParaEditar.titulo);
                setDataAcontecimento(lembrancaParaEditar.dataAcontecimento);
                setLocal(lembrancaParaEditar.local || '');
                setHistoria(lembrancaParaEditar.historia);

                if (lembrancaParaEditar.pessoasPresentes) {
                    setListaPessoas(lembrancaParaEditar.pessoasPresentes.split(',').map(s => s.trim()).filter(Boolean));
                } else {
                    setListaPessoas([]);
                }

                if (lembrancaParaEditar.imagem) {
                    setPreviewUrl(lembrancaParaEditar.imagem);
                } else {
                    setPreviewUrl('');
                }
                setSelectedFile(null);
            } else {
                // Criação: Limpa tudo
                setTitulo('');
                // CORREÇÃO: Usa a função local em vez de toISOString (que usa UTC)
                setDataAcontecimento(getHojeLocal());
                setLocal('');
                setHistoria('');
                setListaPessoas([]);
                setPreviewUrl('');
                setSelectedFile(null);
            }
        }
    }, [open, lembrancaParaEditar]);

    // --- LÓGICA DE ÁUDIO ---
    const handleGravar = (
        isGravando: boolean,
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

        if (isGravando) {
            ref.current.stop();
            setGravando(false);
        } else {
            ref.current.start();
            setGravando(true);
        }
    };

    // --- LÓGICA DE PESSOAS ---
    const handleAddPessoa = () => {
        if (!nomePessoaTemp.trim()) return;
        setListaPessoas([...listaPessoas, nomePessoaTemp.trim()]);
        setNomePessoaTemp('');
    };

    const handleRemovePessoa = (index: number) => {
        const novaLista = [...listaPessoas];
        novaLista.splice(index, 1);
        setListaPessoas(novaLista);
    };

    // --- LÓGICA DE IMAGEM ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- SALVAR ---
    const handleSalvar = async () => {
        // Validação básica
        if (!titulo.trim() || !historia.trim() || !dataAcontecimento) {
            enqueueSnackbar('Título, Data e História são obrigatórios.', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            let base64Image = undefined;

            if (selectedFile) {
                base64Image = await toBase64(selectedFile);
            } else if (lembrancaParaEditar && previewUrl) {
                // Se está editando e não mudou a imagem, não mandamos nada (undefined)
                // O backend deve ignorar. Se a lógica do seu back for diferente, ajuste aqui.
                base64Image = undefined;
            }

            const pessoasString = listaPessoas.join(', ');
            let response: Lembranca;

            if (lembrancaParaEditar) {
                // --- EDIÇÃO ---
                const payload: UpdateLembrancaPayload = {
                    titulo,
                    dataAcontecimento,
                    local,
                    historia,
                    pessoasPresentes: pessoasString,
                    imagem: base64Image
                };
                console.log("Enviando Update:", payload); // DEBUG
                response = await lembrancasApi.atualizar(lembrancaParaEditar.identificadorLembranca, payload);
                enqueueSnackbar('Lembrança atualizada!', { variant: 'success' });
            } else {
                // --- CRIAÇÃO ---
                const payload: CreateLembrancaPayload = {
                    identificadorUsuario: usuarioId,
                    titulo,
                    dataAcontecimento, // Agora usa a data local correta
                    local,
                    historia,
                    pessoasPresentes: pessoasString,
                    imagem: base64Image
                };
                console.log("Enviando Create:", payload); // DEBUG
                response = await lembrancasApi.criar(payload);
                enqueueSnackbar('Lembrança criada!', { variant: 'success' });
            }

            // --- VERIFICA CONQUISTAS ---
            if (response.conquistasDesbloqueadas && response.conquistasDesbloqueadas.length > 0 && onConquistaGanhas) {
                onConquistaGanhas(response.conquistasDesbloqueadas);
            }

            onSuccess();
            onClose();

        } catch (error: any) {
            console.error("Erro ao salvar:", error); // DEBUG NO CONSOLE

            // Tenta mostrar mensagem detalhada se vier do backend
            if (error.response && error.response.data && error.response.data.detail) {
                enqueueSnackbar(`Erro: ${error.response.data.detail}`, { variant: 'error' });
            } else {
                enqueueSnackbar('Erro ao salvar lembrança.', { variant: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    // --- ESTILOS VISUAIS ---
    const cadernoStyle: React.CSSProperties = {
        background: "#f9f7f3",
        backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 39px, #ccc 40px)",
        lineHeight: "40px",
        border: "1px solid #ccc",
        outline: "none", color: "#000", fontSize: "18px", fontFamily: "inherit", resize: "none", boxSizing: "border-box",
    };

    const inputComLinhaStyle: React.CSSProperties = {
        ...cadernoStyle,
        height: '64px',
        padding: '10px 16px',
        borderRadius: '12px',
    };

    const audioButtonStyle: React.CSSProperties = {
        background: "#1976d2", border: "none", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", transition: "all 0.2s", color: "#fff", zIndex: 2, outline: "none"
    };
    const audioButtonActiveStyle: React.CSSProperties = {
        ...audioButtonStyle, background: "#d32f2f", boxShadow: "0 0 0 4px rgba(211, 47, 47, 0.3)", transform: "scale(1.05)"
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" color="primary">
                    {lembrancaParaEditar ? 'Editar Lembrança' : 'Nova Lembrança'}
                </Typography>
                <IconButton onClick={onClose} disabled={loading} size="large">
                    <CloseIcon fontSize="large" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 1 }}>
                <Stack spacing={3}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-lembranca-file"
                            type="file"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                        <label htmlFor="upload-lembranca-file">
                            <Box
                                sx={{
                                    width: 500,
                                    height: 450,
                                    bgcolor: '#fafafa',
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    border: '2px dashed #ccc',
                                    cursor: 'pointer',
                                    transition: 'border 0.3s',
                                    position: 'relative',
                                    '&:hover': { borderColor: '#1976d2', bgcolor: '#f0f7ff' }
                                }}
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Usei 'cover' para preencher melhor o quadrado
                                    />
                                ) : (
                                    <Stack alignItems="center" spacing={1} color="text.secondary">
                                        <CloudUploadIcon sx={{ fontSize: 40 }} /> {/* Ícone um pouco menor tbm */}
                                        <Typography variant="body2">Adicionar foto</Typography> {/* Texto menor */}
                                    </Stack>
                                )}
                            </Box>
                        </label>
                    </Box>

                    {/* 2. TÍTULO */}
                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título da lembrança..."
                            disabled={loading}
                            style={{
                                ...cadernoStyle,
                                width: "100%",
                                height: "64px",
                                padding: "10px 80px 10px 16px",
                                borderRadius: "12px",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => handleGravar(gravandoTitulo, setGravandoTitulo, recognitionTituloRef, setTitulo)}
                            disabled={loading}
                            style={{
                                ...(gravandoTitulo ? audioButtonActiveStyle : audioButtonStyle),
                                position: "absolute",
                                right: 12, top: "50%",
                                transform: gravandoTitulo ? "translateY(-50%) scale(1.05)" : "translateY(-50%)",
                            }}
                            title="Gravar título"
                        >
                            <MicIcon sx={{ fontSize: 28 }} />
                        </button>
                    </Box>

                    {/* 3. DATA E LOCAL */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        {/* Data */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>Data do Acontecimento</Typography>
                            <input
                                type="date"
                                value={dataAcontecimento}
                                onChange={(e) => setDataAcontecimento(e.target.value)}
                                disabled={loading}
                                style={{ ...inputComLinhaStyle, width: "100%" }}
                            />
                        </Box>

                        {/* Local */}
                        <Box sx={{ flex: 1, position: 'relative' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>Local (Opcional)</Typography>
                            <input
                                type="text"
                                value={local}
                                onChange={(e) => setLocal(e.target.value)}
                                placeholder="Ex: Casa da Vovó"
                                disabled={loading}
                                style={{ ...inputComLinhaStyle, width: "100%", paddingRight: "70px" }}
                            />
                            <button
                                type="button"
                                onClick={() => handleGravar(gravandoLocal, setGravandoLocal, recognitionLocalRef, setLocal)}
                                disabled={loading}
                                style={{
                                    ...(gravandoLocal ? audioButtonActiveStyle : audioButtonStyle),
                                    position: "absolute",
                                    right: 8,
                                    bottom: 6,
                                    transform: gravandoLocal ? "scale(1.05)" : "scale(0.9)",
                                }}
                                title="Gravar local"
                            >
                                <MicIcon sx={{ fontSize: 24 }} />
                            </button>
                        </Box>
                    </Stack>

                    {/* 4. PARTICIPANTES */}
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>Participantes</Typography>
                        <Stack direction="row" spacing={1} mb={2}>
                            <Box sx={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    value={nomePessoaTemp}
                                    onChange={(e) => setNomePessoaTemp(e.target.value)}
                                    placeholder="Digite o nome..."
                                    disabled={loading}
                                    style={{ ...inputComLinhaStyle, width: "100%", paddingRight: "70px" }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddPessoa()}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleGravar(gravandoPessoas, setGravandoPessoas, recognitionPessoasRef, setNomePessoaTemp)}
                                    disabled={loading}
                                    style={{
                                        ...(gravandoPessoas ? audioButtonActiveStyle : audioButtonStyle),
                                        position: "absolute",
                                        right: 8,
                                        bottom: 6,
                                        transform: gravandoPessoas ? "scale(1.05)" : "scale(0.9)",
                                    }}
                                    title="Gravar nome"
                                >
                                    <MicIcon sx={{ fontSize: 24 }} />
                                </button>
                            </Box>
                            <Button
                                variant="contained"
                                onClick={handleAddPessoa}
                                disabled={!nomePessoaTemp || loading}
                                sx={{ borderRadius: 3, minWidth: 60, height: 64 }}
                            >
                                <AddIcon fontSize="large" />
                            </Button>
                        </Stack>

                        {/* Lista de Pessoas (Chips) */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {listaPessoas.map((pessoa, index) => (
                                <Chip
                                    key={index}
                                    label={pessoa}
                                    onDelete={() => handleRemovePessoa(index)}
                                    disabled={loading}
                                    sx={{
                                        fontSize: '1rem',
                                        py: 2.5,
                                        px: 1,
                                        borderRadius: 2,
                                        bgcolor: '#f0f0f0'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* 5. HISTÓRIA */}
                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>História da Lembrança</Typography>
                        <textarea
                            value={historia}
                            onChange={(e) => setHistoria(e.target.value)}
                            disabled={loading}
                            placeholder="Conte como foi esse momento especial..."
                            style={{
                                ...cadernoStyle,
                                width: "100%",
                                height: "350px",
                                padding: "10px 16px 80px 16px",
                                borderRadius: "16px",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => handleGravar(gravandoHistoria, setGravandoHistoria, recognitionHistoriaRef, setHistoria)}
                            disabled={loading}
                            style={{
                                ...(gravandoHistoria ? audioButtonActiveStyle : audioButtonStyle),
                                position: "absolute",
                                right: 12,
                                bottom: 16,
                            }}
                            title="Gravar história"
                        >
                            <MicIcon sx={{ fontSize: 28 }} />
                        </button>
                    </Box>

                    {/* BOTÃO SALVAR */}
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

                </Stack>
            </DialogContent>
        </Dialog>
    );
}