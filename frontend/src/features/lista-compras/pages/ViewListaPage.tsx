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
    Snackbar,
    Alert,
    Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { listaViewService, type ListaDTO } from "../api/service/listaViewService.ts";

export default function ViewListaPage() {
    const navigate = useNavigate();

    // mock: trocar depois por auth real
    const userId = 16;

    const [listasUsuario, setListasUsuario] = useState<ListaDTO[]>([]);
    const [templates, setTemplates] = useState<ListaDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // snackbar genérico de erro
    const [snackErroOpen, setSnackErroOpen] = useState(false);
    const [snackErroMsg, setSnackErroMsg] = useState("Erro ao carregar listas.");

    const carregarListas = async () => {
        setLoading(true);
        try {
            const [userLists, tplLists] = await Promise.all([
                listaViewService.listarDoUsuario(userId),
                listaViewService.listarTemplates(),
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
                       }: {
        lista: ListaDTO;
        variant: "template" | "user";
    }) => {
        const isTemplate = variant === "template";

        return (
            <Card
                elevation={0}
                sx={(theme) => ({
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all .15s ease",
                    background: isTemplate
                        ? alpha(theme.palette.primary.light, 0.06)
                        : "#fff",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                        borderColor: isTemplate
                            ? theme.palette.primary.light
                            : theme.palette.grey[300],
                    },
                })}
            >
                <CardActionArea
                    onClick={() => {
                        // aqui você decide navegação futura
                        // por enquanto só exemplificando:
                        // templates -> navegar para criar com base nele
                        // user -> navegar detalhes
                        if (isTemplate) {
                            navigate(`/lista-compras/criar?templateId=${lista.id}`);
                        } else {
                            navigate(`/lista-compras/${lista.id}`);
                        }
                    }}
                    sx={{ p: 0 }}
                >
                    <CardContent sx={{ p: 2 }}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                    sx={(theme) => ({
                                        width: 34,
                                        height: 34,
                                        borderRadius: "50%",
                                        backgroundColor: isTemplate
                                            ? theme.palette.primary.main
                                            : theme.palette.success.main,
                                        display: "grid",
                                        placeItems: "center",
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
                                        color={lista.status === "FINALIZADA" ? "success" : "default"}
                                        variant={lista.status === "FINALIZADA" ? "filled" : "outlined"}
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
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Minhas listas
                    </Typography>
                    <Typography color="text.secondary">
                        Veja suas listas salvas ou use um template rápido.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                    onClick={() => navigate("/lista-compras/criar")}
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
                {/* TEMPLATES */}
                <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                        Templates disponíveis
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
                    ) : templates.length === 0 ? (
                        <Typography color="text.secondary" sx={{ py: 1 }}>
                            Nenhum template cadastrado ainda.
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
                            {templates.map((tpl) => (
                                <ListaCard key={tpl.id} lista={tpl} variant="template" />
                            ))}
                        </Box>
                    )}
                </Stack>

                <Divider sx={{ my: 3 }} />

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
                                <ListaCard key={l.id} lista={l} variant="user" />
                            ))}
                        </Box>
                    )}
                </Stack>

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
                            Nenhuma lista finalizada ainda.
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
                                <ListaCard key={l.id} lista={l} variant="user" />
                            ))}
                        </Box>
                    )}
                </Stack>
            </Paper>

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
