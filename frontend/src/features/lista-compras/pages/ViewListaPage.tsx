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
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";

import { listaViewService, type ListaDTO } from "../api/service/listaViewService.ts";
import { listaComprasService } from "../api/service/listaComprasService.ts";

export default function ViewListaPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // mock: trocar depois por auth real
    const userId = 1;

    const [listasUsuario, setListasUsuario] = useState<ListaDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // filtro de status: abertas | finalizadas | todas
    const [filtroStatus, setFiltroStatus] = useState<"abertas" | "finalizadas" | "todas">("abertas");

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
            const userLists = await listaViewService.listarDoUsuario(userId);
            setListasUsuario(userLists);
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

    // aplica o filtro de status em cima de todas as listas do usuário
    const listasFiltradas = useMemo(() => {
        let base = [...listasUsuario];

        if (filtroStatus === "abertas") {
            base = base.filter((l) => l.status !== "FINALIZADA");
        } else if (filtroStatus === "finalizadas") {
            base = base.filter((l) => l.status === "FINALIZADA");
        }
        // "todas" => não filtra

        return base;
    }, [listasUsuario, filtroStatus]);

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
                           onEditLista,
                       }: {
        lista: ListaDTO;
        variant: "template" | "user" | "finalizada";
        onClick?: (lista: ListaDTO) => void;
        onEditLista?: (lista: ListaDTO) => void;
    }) => {
        const isTemplate = variant === "template";
        const isFinalizada = variant === "finalizada";
        const isAberta = variant === "user" && lista.status !== "FINALIZADA";

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
                            {/* Cabeçalho: ícone + título */}
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                    sx={(theme) => ({
                                        width: 30,
                                        height: 30,
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

                                <Typography
                                    fontWeight={700}
                                    noWrap
                                    variant="body2"
                                >
                                    {lista.titulo}
                                </Typography>
                            </Stack>

                            {/* Chips */}
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                <Chip
                                    size="small"
                                    label={lista.status === "FINALIZADA" ? "Finalizada" : "Aberta"}
                                    icon={
                                        lista.status === "FINALIZADA" ? (
                                            <CheckCircleIcon />
                                        ) : undefined
                                    }
                                    color={lista.status === "FINALIZADA" ? "info" : "success"}
                                    variant="filled"
                                />

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

                            {/* Editar itens no final, alinhado à direita (apenas se aberta) */}
                            {isAberta && (
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                        size="small"
                                        variant="text"
                                        startIcon={<EditIcon />}
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: "0.75rem",
                                            minWidth: "auto",
                                            px: 0.5,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();      // pra não disparar o onClick do card
                                            onEditLista?.(lista);
                                        }}
                                    >
                                        Editar itens
                                    </Button>
                                </Box>
                            )}
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    };

    const handleIrParaEdicao = (lista: ListaDTO) => {
        navigate(`/lista-compras/${lista.id}/editar`);
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 3 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    size={"small"}
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/lista-compras", { replace: true })}
                    sx={{ textTransform: "none", height: 40 }}
                >
                    Voltar
                </Button>
            </Stack>

            {/* Header título + botão – responsivo */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
            >
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
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        width: { xs: "100%", sm: "auto" },   // full no mobile, compacto no desktop
                    }}
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
                {/* Filtros de status */}
                <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                    <Chip
                        label="Abertas"
                        clickable
                        color={filtroStatus === "abertas" ? "primary" : "default"}
                        variant={filtroStatus === "abertas" ? "filled" : "outlined"}
                        onClick={() => setFiltroStatus("abertas")}
                    />
                    <Chip
                        label="Finalizadas"
                        clickable
                        color={filtroStatus === "finalizadas" ? "primary" : "default"}
                        variant={filtroStatus === "finalizadas" ? "filled" : "outlined"}
                        onClick={() => setFiltroStatus("finalizadas")}
                    />
                    <Chip
                        label="Todas"
                        clickable
                        color={filtroStatus === "todas" ? "primary" : "default"}
                        variant={filtroStatus === "todas" ? "filled" : "outlined"}
                        onClick={() => setFiltroStatus("todas")}
                    />
                </Stack>

                {/* GRID ÚNICO DE LISTAS (respeitando o filtro) */}
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
                ) : listasFiltradas.length === 0 ? (
                    <Typography color="text.secondary" sx={{ py: 1 }}>
                        Nenhuma lista encontrada para esse filtro.
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
                        {listasFiltradas.map((l) => (
                            <ListaCard
                                key={l.id}
                                lista={l}
                                variant={l.status === "FINALIZADA" ? "finalizada" : "user"}
                                onClick={handleAbrirLista}
                                onEditLista={handleIrParaEdicao}
                            />
                        ))}
                    </Box>
                )}
            </Paper>

            {/* MODAL DETALHES + ARQUIVAR */}
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
                    {/* Arquivar lista (finalizar) – só se ainda não estiver finalizada */}
                    {listaSelecionada && listaSelecionada.status !== "FINALIZADA" && (
                        <Button
                            color="error"
                            onClick={async () => {
                                try {
                                    await listaComprasService.finalizarLista(listaSelecionada.id);
                                    enqueueSnackbar("Lista arquivada com sucesso.", {
                                        variant: "success",
                                    });
                                    handleFecharModal();
                                    await carregarListas(); // recarrega para refletir o novo status
                                } catch (e: any) {
                                    console.error(e);
                                    const msg =
                                        e.response?.data?.erro ||
                                        "Erro ao arquivar lista.";
                                    enqueueSnackbar(msg, { variant: "error" });
                                }
                            }}
                        >
                            Arquivar lista
                        </Button>
                    )}

                    {/* Reabrir lista – só se estiver finalizada */}
                    {listaSelecionada && listaSelecionada.status === "FINALIZADA" && (
                        <Button
                            color="primary"
                            onClick={async () => {
                                try {
                                    await listaComprasService.reabrirLista(listaSelecionada.id);
                                    enqueueSnackbar("Lista reaberta com sucesso.", {
                                        variant: "success",
                                    });
                                    handleFecharModal();
                                    await carregarListas();           // recarrega dados
                                } catch (e: any) {
                                    console.error(e);
                                    const msg =
                                        e.response?.data?.erro ||
                                        "Erro ao reabrir lista.";
                                    enqueueSnackbar(msg, { variant: "error" });
                                }
                            }}
                        >
                            Reabrir lista
                        </Button>
                    )}

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
