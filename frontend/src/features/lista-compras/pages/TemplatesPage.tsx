// src/features/lista-compras/pages/TemplatesPage.tsx

import { useEffect, useMemo, useState, useCallback } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    CardActionArea,
    Stack,
    Chip,
    Button,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditIcon from "@mui/icons-material/Edit";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import { listaViewService, type ListaDTO } from "../api/service/listaViewService";
import { patologiasService } from "../api/service/patologiaService";
import { listaComprasService } from "../api/service/listaComprasService";
import type { Patologia } from "../types";

export default function TemplatesPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const userId = 1; // Mock user ID

    // Estados de Dados
    const [templates, setTemplates] = useState<ListaDTO[]>([]);
    const [patologias, setPatologias] = useState<Patologia[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de Filtro e Seleção
    const [filtroPatologia, setFiltroPatologia] = useState<number | "Todas">("Todas");
    const [filtroStatus, setFiltroStatus] = useState<"abertas" | "arquivadas" | "todas">("abertas");
    const [templateSelecionado, setTemplateSelecionado] = useState<ListaDTO | null>(null);
    const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);

    // Estados de Criação (Novo Template)
    const [modalCriarOpen, setModalCriarOpen] = useState(false);
    const [novoTemplateTitulo, setNovoTemplateTitulo] = useState("");
    const [novoTemplatePatologia, setNovoTemplatePatologia] = useState<number | "">("");
    const [criandoTemplate, setCriandoTemplate] = useState(false);

    // --- Função de Carga de Dados (Memoizada) ---
    const carregarDados = useCallback(
        async (isReload = false) => {
            if (!isReload) setLoading(true);
            try {
                const [tpls, pats] = await Promise.all([
                    listaViewService.listarTemplates(userId),
                    patologiasService.getPatologiasDoUsuario(userId),
                ]);
                setTemplates(tpls);
                setPatologias(pats);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
                enqueueSnackbar("Erro ao carregar templates.", { variant: "error" });
            } finally {
                setLoading(false);
            }
        },
        [userId, enqueueSnackbar]
    );

    // --- Carga Inicial ---
    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    // --- Filtros (Patologia + Status) ---
    const templatesFiltrados = useMemo(() => {
        let lista = [...templates];

        // 1) Filtro por patologia
        if (filtroPatologia !== "Todas") {
            lista = lista.filter((t) => t.patologiaId === filtroPatologia);
        }

        // 2) Filtro por status
        if (filtroStatus === "abertas") {
            lista = lista.filter((t) => t.status !== "FINALIZADA");
        } else if (filtroStatus === "arquivadas") {
            lista = lista.filter((t) => t.status === "FINALIZADA");
        }
        // "todas" não filtra

        return lista;
    }, [templates, filtroPatologia, filtroStatus]);

    // --- Handlers ---
    const handleAbrirDetalhes = (tpl: ListaDTO) => {
        setTemplateSelecionado(tpl);
        setModalDetalhesOpen(true);
    };

    // Ir para tela de edição de template
    const handleIrParaEdicaoTemplate = (tpl: ListaDTO) => {
        const query = new URLSearchParams();
        query.set("isTemplate", "1");
        if (tpl.patologiaId) {
            query.set("patologiaId", String(tpl.patologiaId));
        }

        // fecha o modal antes de navegar, pra não ficar estado preso
        setModalDetalhesOpen(false);
        navigate(`/lista-compras/${tpl.id}/editar?${query.toString()}`);
    };

    /** Cria template vazio e navega para EditListaPage */
    const handleCriarTemplate = async () => {
        const titulo = novoTemplateTitulo.trim();
        if (!titulo) return;

        if (criandoTemplate) return;
        setCriandoTemplate(true);

        try {
            const payload = {
                titulo,
                isTemplate: true,
                patologiaId: novoTemplatePatologia || undefined,
                itens: [] as { produtoId: number; qtd: number }[],
            };

            const resposta = await listaComprasService.criarLista(payload, userId);

            enqueueSnackbar("Template criado com sucesso! Agora adicione os itens.", {
                variant: "success",
            });

            setModalCriarOpen(false);
            setNovoTemplateTitulo("");
            setNovoTemplatePatologia("");

            await carregarDados(true);

            const query = new URLSearchParams();
            query.set("isTemplate", "1");
            if (novoTemplatePatologia) {
                query.set("patologiaId", String(novoTemplatePatologia));
            }

            navigate(`/lista-compras/${resposta.id}/editar?${query.toString()}`, {
                replace: true,
            });
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.erro || "Erro ao criar template.";
            enqueueSnackbar(msg, { variant: "error" });
        } finally {
            setCriandoTemplate(false);
        }
    };

    // Helper para formatar data
    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString("pt-BR");
        } catch {
            return iso;
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 3 }}>
            {/* Header de Navegação */}
            <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/lista-compras", { replace: true })}
                    sx={{ textTransform: "none", height: 40 }}
                >
                    Voltar
                </Button>
            </Stack>

            {/* Título e Ação Principal */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Meus Templates
                    </Typography>
                    <Typography color="text.secondary">
                        Gerencie listas padrão para suas dietas e necessidades.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setModalCriarOpen(true)}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        width: { xs: "100%", sm: "auto" },     // full-width no mobile
                        alignSelf: { xs: "stretch", sm: "auto" },
                    }}
                >
                    Novo Template
                </Button>
            </Stack>

            {/* Área de Filtros */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 3, backgroundColor: "#fff" }} elevation={0}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                >
                    {/* Filtro por Patologia */}
                    <FormControl
                        size="small"
                        sx={{
                            width: { xs: "100%", sm: 220 },
                        }}
                    >
                        <InputLabel>Filtrar por Patologia</InputLabel>
                        <Select
                            value={filtroPatologia}
                            label="Filtrar por Patologia"
                            onChange={(e) =>
                                setFiltroPatologia(e.target.value as number | "Todas")
                            }
                        >
                            <MenuItem value="Todas">Todas</MenuItem>
                            {patologias.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Filtro por Status */}
                    <FormControl
                        size="small"
                        sx={{
                            width: { xs: "100%", sm: 180 },
                        }}
                    >
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filtroStatus}
                            label="Status"
                            onChange={(e) =>
                                setFiltroStatus(
                                    e.target.value as "abertas" | "arquivadas" | "todas"
                                )
                            }
                        >
                            <MenuItem value="abertas">Abertas</MenuItem>
                            <MenuItem value="arquivadas">Arquivadas</MenuItem>
                            <MenuItem value="todas">Todas</MenuItem>
                        </Select>
                    </FormControl>

                    {(filtroPatologia !== "Todas" || filtroStatus !== "abertas") && (
                        <Chip
                            label="Filtros ativos"
                            onDelete={() => {
                                setFiltroPatologia("Todas");
                                setFiltroStatus("abertas");
                            }}
                            color="primary"
                            variant="outlined"
                        />
                    )}
                </Stack>
            </Paper>

            {/* Grid de Templates */}
            {loading ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} height={120} sx={{ borderRadius: 3, transform: "none" }} />
                    ))}
                </Box>
            ) : templatesFiltrados.length === 0 ? (
                <Paper
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3,
                        bgcolor: "#f8f9fa",
                    }}
                >
                    <Typography color="text.secondary">
                        Nenhum template encontrado para este filtro.
                    </Typography>
                </Paper>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {templatesFiltrados.map((tpl) => {
                        const patNome = patologias.find(
                            (p) => p.id === tpl.patologiaId
                        )?.nome;

                        const isArquivado = tpl.status === "FINALIZADA";

                        return (
                            <Card
                                key={tpl.id}
                                elevation={0}
                                sx={(theme) => ({
                                    borderRadius: 3,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    transition: "all .2s",
                                    opacity: isArquivado ? 0.7 : 1,
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: theme.shadows[4],
                                        borderColor: theme.palette.primary.main,
                                    },
                                })}
                            >
                                <CardActionArea
                                    onClick={() => handleAbrirDetalhes(tpl)}
                                    sx={{ height: "100%", p: 2 }}
                                >
                                    <Stack spacing={1.5}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: "50%",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    bgcolor: (theme) =>
                                                        alpha(
                                                            theme.palette.primary.main,
                                                            0.1
                                                        ),
                                                    color: "primary.main",
                                                }}
                                            >
                                                <ContentCopyIcon />
                                            </Box>
                                            <Stack direction="row" spacing={1}>
                                                {patNome && (
                                                    <Chip
                                                        icon={
                                                            <WarningAmberIcon
                                                                style={{ fontSize: 16 }}
                                                            />
                                                        }
                                                        label={patNome}
                                                        size="small"
                                                        color="warning"
                                                        variant="outlined"
                                                    />
                                                )}
                                                {isArquivado && (
                                                    <Chip
                                                        label="Arquivado"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Stack>
                                        </Stack>

                                        <Box>
                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                noWrap
                                                title={tpl.titulo}
                                            >
                                                {tpl.titulo}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Criado em {formatDate(tpl.createdAt)}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary">
                                            {tpl.itens?.length || 0} itens cadastrados
                                        </Typography>
                                    </Stack>
                                </CardActionArea>
                            </Card>
                        );
                    })}
                </Box>
            )}

            {/* Modal de Detalhes */}
            <Dialog
                open={modalDetalhesOpen}
                onClose={() => setModalDetalhesOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {templateSelecionado?.titulo}
                    <IconButton onClick={() => setModalDetalhesOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <List disablePadding>
                        {templateSelecionado?.itens?.map((item, idx) => (
                            <ListItem
                                key={idx}
                                divider={
                                    idx <
                                    (templateSelecionado.itens?.length || 0) - 1
                                }
                            >
                                <ListItemText
                                    primary={
                                        item.produto?.nome ||
                                        `Produto #${item.produtoId}`
                                    }
                                    secondary={`Quantidade: ${item.qtd}`}
                                />
                            </ListItem>
                        ))}
                        {(!templateSelecionado?.itens ||
                            templateSelecionado.itens.length === 0) && (
                            <Typography color="text.secondary" align="center" py={2}>
                                Este template está vazio.
                            </Typography>
                        )}
                    </List>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2.5 }}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "grid",
                            gap: 1.2,

                            // MOBILE → 2 colunas na primeira linha e 1 botão grande na segunda
                            gridTemplateColumns: {
                                xs: "1fr 1fr",
                                sm: "auto auto auto", // Desktop mantém original
                            },

                            // MOBILE → duas linhas
                            gridTemplateRows: {
                                xs: "auto auto",
                                sm: "auto",
                            },

                            justifyContent: { sm: "flex-end" },
                            alignItems: "center",
                        }}
                    >
                        {/* === EDITAR === */}
                        <Button
                            startIcon={<EditIcon />}
                            onClick={() => handleIrParaEdicaoTemplate(templateSelecionado!)}
                            sx={{
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                width: { xs: "100%", sm: "auto" },
                            }}
                        >
                            Editar
                        </Button>

                        {/* === ARQUIVAR / REABRIR === */}
                        {templateSelecionado?.status !== "FINALIZADA" ? (
                            <Button
                                color="error"
                                onClick={async () => {
                                    await listaComprasService.finalizarLista(templateSelecionado.id);
                                    enqueueSnackbar("Template arquivado.", { variant: "success" });
                                    setModalDetalhesOpen(false);
                                    await carregarDados(true);
                                }}
                                sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                Arquivar
                            </Button>
                        ) : (
                            <Button
                                color="primary"
                                onClick={async () => {
                                    await listaComprasService.reabrirLista(templateSelecionado.id);
                                    enqueueSnackbar("Template reaberto.", { variant: "success" });
                                    setModalDetalhesOpen(false);
                                    await carregarDados(true);
                                }}
                                sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                Reabrir
                            </Button>
                        )}

                        {/* === USAR TEMPLATE === */}
                        <Button
                            variant="contained"
                            onClick={() => navigate("/lista-compras/nova")}
                            sx={{
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                gridColumn: { xs: "1 / 3", sm: "auto" }, // mobile → ocupa a linha inteira
                                width: { xs: "100%", sm: "auto" },
                                mt: { xs: 0.5, sm: 0 },
                            }}
                        >
                            Usar Template
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Modal de Criação */}
            <Dialog
                open={modalCriarOpen}
                onClose={() => !criandoTemplate && setModalCriarOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Criar Novo Template</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Selecione uma patologia para associar a este template.
                            Os alertas serão gerados quando ele for usado em listas
                            de compras.
                        </Typography>

                        <Stack spacing={3}>
                            <TextField
                                label="Nome do Template"
                                fullWidth
                                value={novoTemplateTitulo}
                                onChange={(e) =>
                                    setNovoTemplateTitulo(e.target.value)
                                }
                                placeholder="Ex: Dieta para Café da Manhã"
                                disabled={criandoTemplate}
                            />

                            <FormControl fullWidth disabled={criandoTemplate}>
                                <InputLabel>Patologia (Opcional)</InputLabel>
                                <Select
                                    value={novoTemplatePatologia}
                                    label="Patologia (Opcional)"
                                    onChange={(e) =>
                                        setNovoTemplatePatologia(
                                            e.target.value as number
                                        )
                                    }
                                >
                                    <MenuItem value="">
                                        <em>Nenhuma</em>
                                    </MenuItem>
                                    {patologias.map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        onClick={() => setModalCriarOpen(false)}
                        color="error"
                        disabled={criandoTemplate}
                        sx={{ textTransform: "none" }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCriarTemplate}
                        variant="contained"
                        disabled={!novoTemplateTitulo || criandoTemplate}
                        startIcon={
                            criandoTemplate ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : null
                        }
                        sx={{ textTransform: "none" }}
                    >
                        {criandoTemplate ? "Criando..." : "Criar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
