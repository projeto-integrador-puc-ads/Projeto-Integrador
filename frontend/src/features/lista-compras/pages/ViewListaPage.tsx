import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    CardActionArea,
    CardContent,
    Stack,
    Chip,
    Button,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { listaViewService, type ListaDTO } from "../api/service/listaViewService.ts";

export default function ViewListaPage() {
    const navigate = useNavigate();

    // mock: trocar depois por auth real
    const userId = 1;

    const [listasUsuario, setListasUsuario] = useState<ListaDTO[]>([]);
    const [templates, setTemplates] = useState<ListaDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // snackbar genérico de erro
    const [snackErroOpen, setSnackErroOpen] = useState(false);
    const [snackErroMsg, setSnackErroMsg] = useState("Erro ao carregar listas.");

    const [listaSelecionada, setListaSelecionada] = useState<ListaDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleAbrirLista = (lista: ListaDTO) => {
        setListaSelecionada(lista);
        setModalOpen(true);
    };

    const handleFecharModal = () => {
        setModalOpen(false);
        setListaSelecionada(null);
    };

    const carregarListas = async () => {
        setLoading(true);
        try {
            const [userLists, tplLists] = await Promise.all([
                listaViewService.listarDoUsuario(userId),
                listaViewService.listarTemplates(userId),
            ]);

            setListasUsuario(userLists);
            setTemplates(tplLists);
        } catch {
            setSnackErroMsg("Erro ao carregar listas. Tente novamente.");
            setSnackErroOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarListas();
    }, []);

    const listasAbertas = useMemo(
        () => listasUsuario.filter((l) => l.status !== "FINALIZADA"),
        [listasUsuario]
    );

    const listasFinalizadas = useMemo(
        () => listasUsuario.filter((l) => l.status === "FINALIZADA"),
        [listasUsuario]
    );

    const formatDate = (iso: string) => {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString("pt-BR");
        } catch {
            return iso;
        }
    };

    const ListaCard = ({
                           lista,
                           variant,
                           onClick,
                       }: {
        lista: ListaDTO;
        variant: "template" | "user" | "finalizada";
        onClick?: (lista: ListaDTO) => void;
    }) => {
        const isTemplate = variant === "template";
        const isFinalizada = variant === "finalizada";

        return (
            <Card
                elevation={0}
                sx={(theme) => ({
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isFinalizada ? alpha(theme.palette.grey[400], 0.8) : "divider",
                    background: isFinalizada
                        ? alpha(theme.palette.grey[200], 0.7)
                        : isTemplate
                            ? alpha(theme.palette.primary.light, 0.08)
                            : "#fff",
                    transition: "all .15s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                        borderColor: isFinalizada
                            ? alpha(theme.palette.grey[500], 0.9)
                            : isTemplate
                                ? theme.palette.primary.light
                                : theme.palette.grey[300],
                    },
                })}
            >
                <CardActionArea onClick={() => onClick?.(lista)} sx={{ p: 0 }}>
                    <CardContent sx={{ p: 2 }}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                    sx={(theme) => ({
                                        width: 34,
                                        height: 34,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        backgroundColor: isTemplate
                                            ? theme.palette.primary.main
                                            : isFinalizada
                                                ? theme.palette.grey[500]
                                                : theme.palette.success.main,
                                    })}
                                >
                                    {isTemplate ? (
                                        <ContentCopyIcon sx={{ color: "#fff", fontSize: 18 }} />
                                    ) : (
                                        <ShoppingCartIcon sx={{ color: "#fff", fontSize: 18 }} />
                                    )}
                                </Box>

                                <Typography fontWeight={700} noWrap>
                                    {lista.titulo}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {isTemplate ? (
                                    <Chip size="small" label="Template" variant="outlined" />
                                ) : (
                                    <Chip
                                        size="small"
                                        label={lista.status === "FINALIZADA" ? "Finalizada" : "Aberta"}
                                        icon={
                                            lista.status === "FINALIZADA" ? (
                                                <CheckCircleIcon />
                                            ) : undefined
                                        }

                                        color={
                                            lista.status === "FINALIZADA" ? "info" : "success"
                                        } // azul p/ finalizada, verde p/ aberta
                                        variant="filled"
                                    />
                                )}

                                {!!lista.createdAt && (
                                    <Chip
                                        size="small"
                                        label={`Criada em ${formatDate(lista.createdAt)}`}
                                        variant="outlined"
                                    />
                                )}

                                {!!lista.itens?.length && (
                                    <Chip
                                        size="small"
                                        label={`${lista.itens.length} itens`}
                                        variant="outlined"
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 3 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    size={"small"}
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: "none", height: 40 }}
                >
                    Voltar
                </Button>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Minhas listas
                    </Typography>
                    <Typography color="text.secondary">
                        Veja seu histórico de listas criadas.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                    onClick={() => navigate("/lista-compras/nova")}
                >
                    Nova lista
                </Button>
            </Stack>

            {/* PAPER CONTAINER */}
            <Paper
                sx={{
                    mt: 3,
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    boxShadow: 3,
                    backgroundColor: "#fff",
                }}
            >
                {/* LISTAS ABERTAS */}
                <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                        Listas abertas
                    </Typography>

                    {loading ? (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} height={90} sx={{ borderRadius: 3 }} />
                            ))}
                        </Box>
                    ) : listasAbertas.length === 0 ? (
                        <Typography color="text.secondary" sx={{ py: 1 }}>
                            Você não tem listas abertas no momento.
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                mt: 1,
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {listasAbertas.map((l) => (
                                <ListaCard
                                    key={l.id}
                                    lista={l}
                                    variant="user"
                                    onClick={handleAbrirLista}
                                />
                            ))}
                        </Box>
                    )}
                </Stack>

                {/* DIVISOR */}
                <Divider sx={{ my: 3 }} />

                {/* LISTAS FINALIZADAS */}
                <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                        Listas finalizadas
                    </Typography>

                    {loading ? (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} height={90} sx={{ borderRadius: 3 }} />
                            ))}
                        </Box>
                    ) : listasFinalizadas.length === 0 ? (
                        <Typography color="text.secondary" sx={{ py: 1 }}>
                            Você ainda não tem listas finalizadas.
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                mt: 1,
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {listasFinalizadas.map((l) => (
                                <ListaCard
                                    key={l.id}
                                    lista={l}
                                    variant="finalizada"
                                    onClick={handleAbrirLista}
                                />
                            ))}
                        </Box>
                    )}
                </Stack>
            </Paper>

            <Dialog open={modalOpen} onClose={handleFecharModal} fullWidth maxWidth="sm">
                <DialogTitle>
                    {listaSelecionada?.titulo ?? "Itens da lista"}
                </DialogTitle>

                <DialogContent dividers>
                    {!listaSelecionada?.itens || listaSelecionada.itens.length === 0 ? (
                        <Typography color="text.secondary">
                            Esta lista não possui itens.
                        </Typography>
                    ) : (
                        <List>
                            {listaSelecionada.itens.map((it, idx) => (
                                <ListItem
                                    key={`${it.produto.id}-${idx}`}
                                    divider={idx < listaSelecionada.itens.length - 1}
                                >
                                    <ListItemText
                                        primary={it.produto.nome}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2">
                                                    Quantidade: {it.quantidade}
                                                </Typography>
                                                {it.produto.categoria?.nome && (
                                                    <>
                                                        {" — "}
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {it.produto.categoria.nome}
                                                        </Typography>
                                                    </>
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleFecharModal}>Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR ERRO GENÉRICO */}
            <Snackbar
                open={snackErroOpen}
                autoHideDuration={5000}
                onClose={() => setSnackErroOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setSnackErroOpen(false)}
                    sx={{ width: "100%" }}
                >
                    {snackErroMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}
