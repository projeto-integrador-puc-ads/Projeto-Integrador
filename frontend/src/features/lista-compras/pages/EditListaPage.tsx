import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Stack,
    Snackbar,
    Paper,
    Chip,
    Tooltip,
    Alert,
    ListItemIcon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RecommendIcon from "@mui/icons-material/Recommend";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { alpha } from "@mui/material/styles";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import type {
    Produto,
    ListaItemVM,
    Patologia,
    ProdutoSubstituivel,
} from "../types";
import { listaComprasService } from "../api/service/listaComprasService.ts";
import {
    listaViewService,
    type ListaDTO,
} from "../api/service/listaViewService.ts";
import { patologiasService } from "../api/service/patologiaService.ts";
import { produtoService } from "../api/service/produtoService.ts";

const normalize = (s: string) => s.trim().toLowerCase();
const userIdTemp = 1; // TODO: trocar pelo ID do usuário logado

export default function EditListaPage() {
    const navigate = useNavigate();
    const { listaId } = useParams<{ listaId: string }>();
    const [searchParams] = useSearchParams();

    const [catalogo, setCatalogo] = useState<Produto[]>([]);
    const [listaItens, setListaItens] = useState<ListaItemVM[]>([]);

    const [inputValue, setInputValue] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
        null
    );
    const [opcoesAutocomplete, setOpcoesAutocomplete] = useState<
        { label: string; value: number }[]
    >([]);

    const [riscosPorProduto, setRiscosPorProduto] = useState<
        Record<number, ProdutoSubstituivel[]>
    >({});

    const [patologias, setPatologias] = useState<Patologia[]>([]);
    const [loadingInicial, setLoadingInicial] = useState(true);

    const [warnOpen, setWarnOpen] = useState(false);
    const [warnMsg, setWarnMsg] = useState("");

    const [tituloLista, setTituloLista] = useState("");

    const [saving, setSaving] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [successOpen, setSuccessOpen] = useState(false);

    // 🔹 Agora isTemplate e patologiaTemplateId são só estados, sem duplicar com const
    const [isTemplate, setIsTemplate] = useState(false);
    const [patologiaTemplateId, setPatologiaTemplateId] = useState<number | null>(null);

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setErrorOpen(true);
    };

    // Carregar patologias e lista que será editada
    useEffect(() => {
        const carregar = async () => {
            if (!listaId) {
                showError("Lista não encontrada.");
                setLoadingInicial(false);
                return;
            }

            try {
                setLoadingInicial(true);

                // 1) Buscar detalhes da lista pelo ID
                const lista: ListaDTO = await listaViewService.buscarPorId(Number(listaId));

                setTituloLista(lista.titulo ?? "");

                // Definir se é template (vem do back)
                const templateFlag = !!(lista as any).template || !!(lista as any).isTemplate;
                setIsTemplate(templateFlag);

                // Patologia vinda do back ou da query
                const patologiaIdFromQuery = searchParams.get("patologiaId");
                const patologiaIdEfetiva =
                    (lista.patologiaId as number | null) ??
                    (patologiaIdFromQuery ? Number(patologiaIdFromQuery) : null);

                setPatologiaTemplateId(patologiaIdEfetiva ?? null);

                // 2) Patologias para exibição
                if (templateFlag) {
                    // 🔸 Template:
                    // - Se tiver patologia → mostra só ela
                    // - Se NÃO tiver → não mostra nada (sem validação)
                    if (patologiaIdEfetiva) {
                        const pat = await patologiasService.getPatologiaById(patologiaIdEfetiva);
                        setPatologias([pat]);
                    } else {
                        setPatologias([]);
                    }
                } else {
                    // 🔸 Lista normal: patologias do usuário
                    const pats = await patologiasService.getPatologiasDoUsuario(userIdTemp);
                    setPatologias(pats);
                }

                // 3) Montar ListaItemVM a partir da ListaDTO
                const itensVM: ListaItemVM[] =
                    lista.itens?.map((it) => {
                        const pApi = it.produto;

                        const produto: Produto = {
                            id: pApi.id,
                            nome: pApi.nome,
                            nome_normalizado:
                                (pApi as any).nomeNormalizado?.toLowerCase().trim() ??
                                pApi.nome.toLowerCase().trim(),
                            ativo: (pApi as any).ativo ?? true,
                            is_personalizado: (pApi as any).isPersonalizado ?? false,
                        };

                        return {
                            produto,
                            qtd: it.quantidade ?? 1,
                        };
                    }) ?? [];

                setListaItens(itensVM);

                // 4) Catálogo inicial
                const catalogoInicial: Produto[] = [];
                const ids = new Set<number>();
                itensVM.forEach((li) => {
                    if (!ids.has(li.produto.id)) {
                        ids.add(li.produto.id);
                        catalogoInicial.push(li.produto);
                    }
                });
                setCatalogo(catalogoInicial);
            } catch (e) {
                console.error(e);
                showError("Erro ao carregar dados da lista para edição.");
            } finally {
                setLoadingInicial(false);
            }
        };

        carregar();
    }, [listaId, searchParams]);

    // Autocomplete: buscar produtos pelo nome
    useEffect(() => {
        if (inputValue.trim().length < 3) {
            setOpcoesAutocomplete([]);
            return;
        }
        let ativo = true;
        const handler = setTimeout(async () => {
            try {
                const produtos = await listaComprasService.searchProdutosByNome(
                    inputValue
                );
                if (!ativo) return;

                setOpcoesAutocomplete(
                    produtos.map((p) => ({
                        label: p.nome,
                        value: p.id,
                    }))
                );
            } catch (e) {
                showError("Erro ao buscar produtos para autocomplete.");
            }
        }, 300);

        return () => {
            ativo = false;
            clearTimeout(handler);
        };
    }, [inputValue]);

    const ensureProduto = (nomeDigitado: string): Produto => {
        const nn = normalize(nomeDigitado);
        const existente = catalogo.find((p) => p.nome_normalizado === nn);
        if (existente) return existente;

        const novo: Produto = {
            id: -Date.now(),
            nome: nomeDigitado.trim(),
            nome_normalizado: nn,
            ativo: true,
            is_personalizado: true,
        };
        setCatalogo((prev) => [novo, ...prev]);
        return novo;
    };

    const addProdutoNaLista = (produto: Produto, qtd = 1) => {
        setListaItens((prev) => {
            const idx = prev.findIndex((li) => li.produto.id === produto.id);
            if (idx >= 0) {
                const clone = [...prev];
                clone[idx] = { ...clone[idx], qtd: clone[idx].qtd + qtd };
                return clone;
            }
            return [...prev, { produto, qtd }];
        });
    };

    const handleAdicionar = async () => {
        const texto = (produtoSelecionado?.nome || inputValue).trim();
        if (!texto) return;

        const p = produtoSelecionado ?? ensureProduto(texto);
        addProdutoNaLista(p, 1);
        setProdutoSelecionado(null);
        setInputValue("");

        // 🔹 Validação de substituíveis
        if (p.id > 0) {
            try {
                let substituiveis: ProdutoSubstituivel[] = [];

                if (!isTemplate) {
                    // LISTA NORMAL → valida pelas patologias do usuário
                    substituiveis = await produtoService.listarSubstituiveis(
                        p.id,
                        userIdTemp
                    );
                } else if (isTemplate && patologiaTemplateId) {
                    // TEMPLATE COM patologia vinculada → valida só por ela
                    substituiveis = await produtoService.listarSubstituiveisPorPatologia(
                        p.id,
                        patologiaTemplateId
                    );
                } else {
                    // TEMPLATE SEM patologia → sem validação
                    substituiveis = [];
                }

                if (substituiveis.length > 0) {
                    setRiscosPorProduto((prev) => ({
                        ...prev,
                        [p.id]: substituiveis,
                    }));

                    const nomesPats = Array.from(
                        new Set(substituiveis.map((s) => s.patologia.nome))
                    ).join(", ");

                    setWarnMsg(
                        `Atenção: "${p.nome}" pode não ser adequado para: ${nomesPats}. ` +
                        `Veja as sugestões na lista.`
                    );
                    setWarnOpen(true);
                }
            } catch (e) {
                console.error("Erro ao buscar substituíveis para produto", p, e);
            }
        }
    };

    const substituirProdutoNaLista = (produtoId: number, sugestao: Produto) => {
        setListaItens((prev) =>
            prev.map((li) =>
                li.produto.id === produtoId ? { ...li, produto: sugestao } : li
            )
        );

        setCatalogo((prev) => {
            const exists = prev.some((p) => p.id === sugestao.id);
            return exists ? prev : [sugestao, ...prev];
        });

        setRiscosPorProduto((prev) => {
            const clone = { ...prev };
            delete clone[produtoId];
            return clone;
        });
    };

    const handleLimparLista = () => {
        setListaItens([]);
        setProdutoSelecionado(null);
        setInputValue("");
    };

    const incQtd = (id: number) =>
        setListaItens((prev) =>
            prev.map((li) =>
                li.produto.id === id ? { ...li, qtd: li.qtd + 1 } : li
            )
        );

    const decQtd = (id: number) =>
        setListaItens((prev) =>
            prev.map((li) =>
                li.produto.id === id ? { ...li, qtd: Math.max(1, li.qtd - 1) } : li
            )
        );

    const remover = (id: number) =>
        setListaItens((prev) => prev.filter((li) => li.produto.id !== id));

    const handleSalvarAlteracoes = async () => {
        if (saving) return;
        if (!listaId) return;

        const titulo = tituloLista.trim();

        if (!titulo) {
            showError("Informe um título para a lista.");
            return;
        }

        if (listaItens.length === 0) {
            showError("Adicione ao menos um item na lista.");
            return;
        }

        const itensValidos = listaItens.filter((li) => li.produto.id > 0);

        if (itensValidos.length === 0) {
            showError("Não há itens válidos para salvar (apenas personalizados locais).");
            return;
        }

        const payload = {
            titulo,
            itens: itensValidos.map((li) => ({
                produtoId: li.produto.id,
                qtd: li.qtd,
            })),
        };

        try {
            setSaving(true);

            await listaComprasService.atualizarLista(Number(listaId), payload);

            setSuccessOpen(true);

            navigate(isTemplate ? "/lista-compras/templates" : "/lista-compras/listas");
        } catch (e) {
            console.error(e);
            showError("Erro ao salvar alterações da lista. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    if (loadingInicial) {
        return (
            <Box sx={{ maxWidth: 900, mx: "auto", py: 4 }}>
                <Typography color="text.secondary">Carregando lista...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate(isTemplate ? "/lista-compras/templates" : "/lista-compras/listas", {
                            replace: true,
                        })
                    }
                    sx={{ textTransform: "none", height: 40 }}
                >
                    Voltar
                </Button>
            </Stack>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 2 }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1 }}>
                        {isTemplate ? "Editar template de compras" : "Editar lista de compras"}
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Atualize os itens, quantidades ou adicione novos produtos.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                        navigate(isTemplate ? "/lista-compras/templates" : "/lista-compras/listas")
                    }
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        height: 42,
                        mt: { xs: 2, sm: 0 },
                    }}
                >
                    {isTemplate ? "Meus templates" : "Minhas listas"}
                </Button>
            </Stack>

            <TextField
                sx={{ mt: 3 }}
                fullWidth
                label="Título da lista"
                placeholder="Ex: Compras da semana"
                value={tituloLista}
                onChange={(e) => setTituloLista(e.target.value)}
            />

            {/* Patologias do usuário / do template */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: 3 }}
            >
                {patologias.length === 0 ? (
                    <Typography color="text.secondary">
                        {isTemplate
                            ? "Este template não possui patologia associada."
                            : "Nenhuma condição carregada ainda."}
                    </Typography>
                ) : (
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        {patologias.map((p) => (
                            <Chip
                                key={p.id}
                                icon={<WarningAmberIcon />}
                                label={p.nome}
                                variant="outlined"
                                sx={(theme) => ({
                                    py: 1,
                                    px: 1.6,
                                    fontSize: "0.875rem",
                                    borderRadius: 8,
                                    fontWeight: 500,
                                    color: theme.palette.warning.dark,
                                    backdropFilter: "blur(10px)",
                                    backgroundColor: alpha(theme.palette.warning.light, 0.42),
                                    borderColor: alpha(theme.palette.warning.dark, 0.45),
                                    boxShadow: `0 2px 6px ${alpha(
                                        theme.palette.common.black,
                                        0.08
                                    )}`,
                                    "& .MuiChip-icon": {
                                        color: theme.palette.warning.dark,
                                        fontSize: "1.3rem",
                                        marginLeft: "2px",
                                    },
                                })}
                            />
                        ))}
                    </Stack>
                )}
            </Stack>

            {/* Adicionar itens + Lista */}
            <Paper
                sx={{
                    mb: 3,
                    p: 2.5,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: "#ffffff",
                }}
            >
                <Stack spacing={2}>
                    {/* Campo de adição */}
                    <Box>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 1 }}
                        >
                            <Typography variant="subtitle1" fontWeight={600}>
                                Adicionar itens
                            </Typography>

                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={handleLimparLista}
                                disabled={saving}
                                sx={{ textTransform: "none" }}
                            >
                                Limpar lista
                            </Button>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                            <Autocomplete
                                fullWidth
                                options={opcoesAutocomplete}
                                inputValue={inputValue}
                                onInputChange={(_, v) => setInputValue(v)}
                                onChange={(_, opt) => {
                                    if (!opt) {
                                        setProdutoSelecionado(null);
                                        return;
                                    }

                                    let p = catalogo.find((c) => c.id === opt.value) || null;

                                    if (!p) {
                                        p = {
                                            id: opt.value,
                                            nome: opt.label,
                                            nome_normalizado: opt.label.toLowerCase(),
                                            ativo: true,
                                            is_personalizado: false,
                                        };
                                        setCatalogo((prev) => [p!, ...prev]);
                                    }

                                    setProdutoSelecionado(p);
                                }}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Adicionar item"
                                        placeholder="Digite ou selecione um produto..."
                                        size="medium"
                                    />
                                )}
                            />
                            <Button
                                onClick={handleAdicionar}
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{
                                    px: 3,
                                    minWidth: { xs: "100%", sm: 140 },
                                    height: 56,
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Adicionar
                            </Button>
                        </Stack>
                    </Box>

                    {/* Itens da lista */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                            Itens da lista
                        </Typography>

                        <List
                            disablePadding
                            sx={{
                                backgroundColor: "#ffffff",
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden",
                            }}
                        >
                            {listaItens.length === 0 && (
                                <Typography color="text.secondary" sx={{ p: 2 }}>
                                    Sua lista está vazia. Adicione itens acima.
                                </Typography>
                            )}

                            {listaItens.map((li, idx) => {
                                const riscos = riscosPorProduto[li.produto.id] ?? [];
                                const hasRisk = riscos.length > 0;
                                const primeiraSugestao = riscos[0]?.produtoSugestao;

                                return (
                                    <ListItem
                                        key={li.produto.id}
                                        sx={(theme) => ({
                                            px: 2,
                                            height: 60,
                                            alignItems: "center",
                                            borderBottom:
                                                idx < listaItens.length - 1
                                                    ? `1px solid ${theme.palette.divider}`
                                                    : "none",
                                            ...(hasRisk && {
                                                borderLeft: `3px solid ${theme.palette.warning.main}`,
                                                backgroundColor: theme.palette.action.hover,
                                            }),
                                        })}
                                        secondaryAction={
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                            >
                                                {hasRisk && primeiraSugestao && (
                                                    <Tooltip
                                                        title={`Trocar por ${primeiraSugestao.nome}`}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            color="warning"
                                                            onClick={() =>
                                                                substituirProdutoNaLista(li.produto.id, {
                                                                    id: primeiraSugestao.id,
                                                                    nome: primeiraSugestao.nome,
                                                                    nome_normalizado:
                                                                        primeiraSugestao.nomeNormalizado
                                                                            ?.toLowerCase()
                                                                            .trim() ??
                                                                        primeiraSugestao.nome.toLowerCase().trim(),
                                                                    ativo: primeiraSugestao.ativo ?? true,
                                                                    is_personalizado:
                                                                        primeiraSugestao.isPersonalizado ?? false,
                                                                })
                                                            }
                                                        >
                                                            <RecommendIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                <IconButton
                                                    size="small"
                                                    onClick={() => decQtd(li.produto.id)}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>

                                                <Typography
                                                    variant="body2"
                                                    sx={{ minWidth: 18, textAlign: "center" }}
                                                >
                                                    {li.qtd}
                                                </Typography>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => incQtd(li.produto.id)}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => remover(li.produto.id)}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        }
                                    >
                                        {hasRisk ? (
                                            <ListItemIcon sx={{ minWidth: 30 }}>
                                                <Tooltip
                                                    title={
                                                        <Box>
                                                            <Typography fontWeight={600}>
                                                                Pode não ser adequado para:
                                                            </Typography>
                                                            {riscos.map((r) => (
                                                                <Box key={r.patologia.id}>
                                                                    • {r.patologia.nome} — sugerido:{" "}
                                                                    <b>{r.produtoSugestao.nome}</b>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    }
                                                >
                                                    <WarningAmberIcon
                                                        color="warning"
                                                        fontSize="small"
                                                    />
                                                </Tooltip>
                                            </ListItemIcon>
                                        ) : (
                                            <ListItemIcon sx={{ minWidth: 30 }} />
                                        )}

                                        <ListItemText
                                            primary={
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <Typography fontWeight={600}>
                                                        {li.produto.nome}
                                                    </Typography>

                                                    {li.produto.is_personalizado && (
                                                        <Chip
                                                            size="small"
                                                            label="Personalizado"
                                                            variant="outlined"
                                                        />
                                                    )}

                                                    {hasRisk && (
                                                        <Typography
                                                            variant="caption"
                                                            sx={(theme) => ({
                                                                color: theme.palette.warning.dark,
                                                            })}
                                                        >
                                                            · restrição
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Stack>
            </Paper>

            {/* Ações finais */}
            <Stack
                direction="row"
                justifyContent={"flex-end"}
                spacing={1}
                sx={{ mt: 3 }}
            >
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                        navigate(isTemplate ? "/lista-compras/templates" : "/lista-compras/listas")
                    }
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSalvarAlteracoes}
                    startIcon={<CheckCircleIcon />}
                    disabled={saving || listaItens.length === 0}
                >
                    {saving ? "Salvando..." : "Salvar alterações"}
                </Button>
            </Stack>

            {/* Snackbars */}
            <Snackbar
                open={warnOpen}
                autoHideDuration={7000}
                onClose={() => setWarnOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setWarnOpen(false)}
                    severity="warning"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {warnMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={successOpen}
                autoHideDuration={4000}
                onClose={() => {
                    setSuccessOpen(false);
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSuccessOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Lista atualizada com sucesso!
                </Alert>
            </Snackbar>

            <Snackbar
                open={errorOpen}
                autoHideDuration={6000}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setErrorOpen(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}
