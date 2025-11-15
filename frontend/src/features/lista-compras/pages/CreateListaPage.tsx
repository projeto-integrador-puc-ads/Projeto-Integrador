import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
    Button,
    Card,
    CardActionArea,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Stack,
    Snackbar,
    Paper,
    Chip,
    Tooltip,
    Alert,
    ListItemIcon,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RecommendIcon from '@mui/icons-material/Recommend';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

/** ========= Tipos (alinhados ao banco) ========= */
type Produto = {
    id: number;
    nome: string;
    nome_normalizado: string;
    ativo: boolean;
    is_personalizado: boolean;
    // tags?: string[] // (se quiser, mantém)
};

type ListaItemVM = { produto: Produto; qtd: number };

type Template = {
    id: number;
    titulo: string;
    is_template: boolean;
    itens: { produto_id: number; qtd: number }[];
};

type Patologia = { id: number; nome: string };
type PatologiaItem = { patologia_id: number; produto_id: number; nivel?: 'baixa' | 'media' | 'alta' };

/** =============== MOCKS =============== */
// Produtos (ampliei a lista)
const mockProdutos: Produto[] = [
    { id: 1, nome: 'Leite', nome_normalizado: 'leite', ativo: true, is_personalizado: false },
    { id: 2, nome: 'Café', nome_normalizado: 'cafe', ativo: true, is_personalizado: false },
    { id: 3, nome: 'Filtro de Papel', nome_normalizado: 'filtro de papel', ativo: true, is_personalizado: false },
    { id: 4, nome: 'Arroz', nome_normalizado: 'arroz', ativo: true, is_personalizado: false },
    { id: 5, nome: 'Feijão', nome_normalizado: 'feijao', ativo: true, is_personalizado: false },
    { id: 6, nome: 'Pão Integral', nome_normalizado: 'pao integral', ativo: true, is_personalizado: false },
    { id: 7, nome: 'Iogurte', nome_normalizado: 'iogurte', ativo: true, is_personalizado: false },
    { id: 8, nome: 'Queijo Mussarela', nome_normalizado: 'queijo mussarela', ativo: true, is_personalizado: false },
    { id: 9, nome: 'Achocolatado', nome_normalizado: 'achocolatado', ativo: true, is_personalizado: false },
    { id: 10, nome: 'Refrigerante', nome_normalizado: 'refrigerante', ativo: true, is_personalizado: false },
    { id: 11, nome: 'Açúcar', nome_normalizado: 'acucar', ativo: true, is_personalizado: false },
    { id: 12, nome: 'Macarrão', nome_normalizado: 'macarrao', ativo: true, is_personalizado: false },
    { id: 13, nome: 'Presunto', nome_normalizado: 'presunto', ativo: true, is_personalizado: false },
    { id: 14, nome: 'Linguiça', nome_normalizado: 'linguica', ativo: true, is_personalizado: false },
    { id: 15, nome: 'Sal', nome_normalizado: 'sal', ativo: true, is_personalizado: false },
];

const mockTemplates: Template[] = [
    {
        id: 101,
        titulo: 'Café da Manhã',
        is_template: true,
        itens: [
            { produto_id: 1, qtd: 1 }, // Leite
            { produto_id: 2, qtd: 1 }, // Café
            { produto_id: 6, qtd: 1 }, // Pão Integral
            { produto_id: 7, qtd: 2 }, // Iogurte
            { produto_id: 9, qtd: 1 }, // Achocolatado
        ],
    },
    {
        id: 102,
        titulo: 'Feira da Semana',
        is_template: true,
        itens: [
            { produto_id: 4, qtd: 2 }, // Arroz
            { produto_id: 5, qtd: 2 }, // Feijão
            { produto_id: 12, qtd: 1 }, // Macarrão
        ],
    },
];

/** Recomendações (mock simples) */
const mockRelacionados: Record<number, number[]> = {
    2: [3],     // Café → Filtro de Papel
    4: [5],     // Arroz → Feijão
    1: [6, 2],  // Leite → Pão Integral, Café
};
const mockPopulares: number[] = [4, 5, 1, 2, 6];

/** Patologias do usuário (mock da “integração”) */
const mockFetchUserPatologias = async (): Promise<Patologia[]> => {
    // simula uma chamada externa
    await new Promise(r => setTimeout(r, 300));
    return [
        { id: 100, nome: 'Intolerância à Lactose' },
        { id: 300, nome: 'Hipertensão' },
    ];
};

/** Mapeamento patologia → produto(s) que disparam alerta (patologia_itens) */
const mockPatologiaItens: PatologiaItem[] = [
    // Lactose
    { patologia_id: 100, produto_id: 1, nivel: 'alta' },  // Leite
    { patologia_id: 100, produto_id: 7, nivel: 'media' }, // Iogurte
    { patologia_id: 100, produto_id: 8, nivel: 'media' }, // Queijo Mussarela
    { patologia_id: 100, produto_id: 9, nivel: 'baixa' }, // Achocolatado (pode conter leite)

    // Glúten
    { patologia_id: 200, produto_id: 6, nivel: 'alta' },  // Pão Integral
    { patologia_id: 200, produto_id: 12, nivel: 'media' },// Macarrão

    // Hipertensão (sódio embutidos e sal)
    { patologia_id: 300, produto_id: 13, nivel: 'media' },// Presunto
    { patologia_id: 300, produto_id: 14, nivel: 'media' },// Linguiça
    { patologia_id: 300, produto_id: 15, nivel: 'alta' }, // Sal
    { patologia_id: 300, produto_id: 10, nivel: 'baixa' },// Refrigerante (sódio em algumas marcas)

    // Diabetes (açúcares simples)
    { patologia_id: 400, produto_id: 11, nivel: 'alta' }, // Açúcar
    { patologia_id: 400, produto_id: 9,  nivel: 'media' },// Achocolatado
    { patologia_id: 400, produto_id: 10, nivel: 'media' },// Refrigerante
];

/** normalização simples */
const normalize = (s: string) => s.trim().toLowerCase();

/** ======================= Página ======================= */
export default function CreateListaPage() {
    const navigate = useNavigate();

    // catálogo / lista
    const [catalogo, setCatalogo] = useState<Produto[]>(mockProdutos);
    const [listaItens, setListaItens] = useState<ListaItemVM[]>([]);

    // autocomplete
    const [inputValue, setInputValue] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    // snack recomendação
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState('');
    const snackProdutoSugeridoRef = useRef<Produto | null>(null);

    // patologias do usuário (mock da integração)
    const [patologias, setPatologias] = useState<Patologia[]>([]);
    const [loadingPats, setLoadingPats] = useState(false);

    // snackbar de alerta por patologia
    const [warnOpen, setWarnOpen] = useState(false);
    const [warnMsg, setWarnMsg] = useState('');

    // índices úteis
    const opcoesAutocomplete = useMemo(
        () => catalogo.filter(p => p.ativo).map(p => ({ label: p.nome, value: p.id })),
        [catalogo]
    );
    const produtosPorId = useMemo(() => {
        const map = new Map<number, Produto>();
        catalogo.forEach(p => map.set(p.id, p));
        return map;
    }, [catalogo]);
    const itensIdsNaLista = useMemo(() => new Set(listaItens.map(li => li.produto.id)), [listaItens]);

    // índice produto_id -> [patologias que disparam]
    const patPorProduto = useMemo(() => {
        const byProd = new Map<number, { patologia: Patologia; nivel: 'baixa' | 'media' | 'alta' }[]>();
        for (const pi of mockPatologiaItens) {
            const pat = patologias.find(p => p.id === pi.patologia_id);
            if (!pat) continue; // só consideramos patologias do usuário
            const arr = byProd.get(pi.produto_id) || [];
            arr.push({ patologia: pat, nivel: pi.nivel || 'media' });
            byProd.set(pi.produto_id, arr);
        }
        return byProd;
    }, [patologias]);

    // simula carregar patologias do usuário (integração)
    useEffect(() => {
        const load = async () => {
            setLoadingPats(true);
            const pats = await mockFetchUserPatologias();
            setPatologias(pats);
            setLoadingPats(false);
        };
        load();
    }, []);

    const ensureProduto = (nomeDigitado: string): Produto => {
        const nn = normalize(nomeDigitado);
        const existente = catalogo.find(p => p.nome_normalizado === nn);
        if (existente) return existente;
        const novo: Produto = {
            id: -Date.now(),
            nome: nomeDigitado.trim(),
            nome_normalizado: nn,
            ativo: true,
            is_personalizado: true,
        };
        setCatalogo(prev => [novo, ...prev]);
        return novo;
    };

    const addProdutoNaLista = (produto: Produto, qtd = 1) => {
        setListaItens(prev => {
            const idx = prev.findIndex(li => li.produto.id === produto.id);
            if (idx >= 0) {
                const clone = [...prev];
                clone[idx] = { ...clone[idx], qtd: clone[idx].qtd + qtd };
                return clone;
            }
            return [...prev, { produto, qtd }];
        });

        // alerta por patologia (não bloqueia)
        const pats = patPorProduto.get(produto.id);
        if (pats && pats.length) {
            const nomes = pats.map(p => p.patologia.nome).join(', ');
            setWarnMsg(`Atenção: "${produto.nome}" pode ser inadequado para: ${nomes}.`);
            setWarnOpen(true);
        }

        // recomendação
        simulateFetchRecomendacao(produto);
    };

    const simulateFetchRecomendacao = (base: Produto) => {
        setTimeout(() => {
            const candidatosIds =
                mockRelacionados[base.id] && mockRelacionados[base.id].length
                    ? mockRelacionados[base.id]
                    : mockPopulares;

            const candidato = candidatosIds
                .map(id => produtosPorId.get(id))
                .filter((p): p is Produto => !!p && !itensIdsNaLista.has(p.id) && p.id !== base.id)[0];

            if (candidato) {
                snackProdutoSugeridoRef.current = candidato;
                setSnackMsg(`Recomendação: adicionar também "${candidato.nome}"?`);
                setSnackOpen(true);
            }
        }, 400);
    };

    const handleAdicionar = () => {
        const texto = (produtoSelecionado?.nome || inputValue).trim();
        if (!texto) return;
        const p = produtoSelecionado ?? ensureProduto(texto);
        addProdutoNaLista(p, 1);
        setProdutoSelecionado(null);
        setInputValue('');
    };

    const copiarTemplate = (tpl: Template) => {
        const novos = tpl.itens
            .map(it => produtosPorId.get(it.produto_id))
            .filter((p): p is Produto => !!p)
            .map(p => ({ produto: p, qtd: tpl.itens.find(i => i.produto_id === p.id)?.qtd ?? 1 }));

        setListaItens(prev => {
            const map = new Map<number, number>();
            prev.forEach(li => map.set(li.produto.id, (map.get(li.produto.id) || 0) + li.qtd));
            novos.forEach(li => map.set(li.produto.id, (map.get(li.produto.id) || 0) + li.qtd));
            return Array.from(map.entries()).map(([id, qtd]) => ({
                produto: produtosPorId.get(id)!,
                qtd,
            }));
        });
    };

    const incQtd = (id: number) =>
        setListaItens(prev => prev.map(li => (li.produto.id === id ? { ...li, qtd: li.qtd + 1 } : li)));
    const decQtd = (id: number) =>
        setListaItens(prev =>
            prev.map(li => (li.produto.id === id ? { ...li, qtd: Math.max(1, li.qtd - 1) } : li))
        );
    const remover = (id: number) => setListaItens(prev => prev.filter(li => li.produto.id !== id));

    return (
        <Box sx={{  maxWidth: 900, mx: 'auto' }}>
            {/* Header */}
            <Stack  direction="row" alignItems="center"  sx={{ mb: 2 }}>
                <Button variant="outlined" size={"small"} startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ textTransform: 'none', height: 40 }}>
                    Voltar
                </Button>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Criar Nova Lista de Compras
            </Typography>
            <Typography color="text.secondary" >
                Monte sua lista adicionando itens ou use um modelo pronto.
            </Typography>

            {/* Patologias do usuário */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 3 }}>
                    {patologias.length === 0 ? (
                        <Typography color="text.secondary">Nenhuma condição carregada ainda.</Typography>
                    ) : (
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                            {patologias.map(p => (
                                <Chip
                                    key={p.id}
                                    icon={<WarningAmberIcon />}
                                    label={p.nome}
                                    variant="outlined"
                                    sx={(theme) => ({
                                        py: 1,
                                        px: 1.6,
                                        fontSize: '0.875rem',
                                        borderRadius: 8,
                                        fontWeight: 500,
                                        color: theme.palette.warning.dark,
                                        backdropFilter: 'blur(10px)',
                                        backgroundColor: alpha(theme.palette.warning.light, 0.42),
                                        borderColor: alpha(theme.palette.warning.dark, 0.45),
                                        boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.08)}`,
                                        '& .MuiChip-icon': {
                                            color: theme.palette.warning.dark,
                                            fontSize: '1.3rem',
                                            marginLeft: '2px',
                                        },
                                    })}
                                />
                            ))}
                        </Stack>
                    )}
                </Stack>



            {/* Templates */}
            <Paper
                sx={{

                    mb: 3,
                    p: 2.5,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: '#ffffff',
                }}
            >
                <Stack spacing={2}>
                    <Box>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 1 }}
                        >
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                sx={{ color: 'text.secondary', letterSpacing: 0.2 }}
                            >
                                Modelos rápidos
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Clique para preencher a lista com um modelo pronto
                            </Typography>
                        </Stack>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                height: 50,
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 1.5,
                            }}
                        >
                            {mockTemplates.map((t) => (
                                <Card
                                    key={t.id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 3,
                                            borderColor: 'primary.light',
                                        },
                                    }}
                                >
                                    <CardActionArea onClick={() => copiarTemplate(t)} sx={{ py: 1, px: 1.5 }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Box
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '50%',
                                                    bgcolor: 'primary.light',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <ContentCopyIcon sx={{ color: 'white', fontSize: '1rem' }} />
                                            </Box>
                                            <Box>
                                                <Typography fontWeight={600} variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                    {t.titulo}
                                                </Typography>

                                            </Box>
                                        </Stack>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                            Adicionar itens
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <Autocomplete
                                fullWidth
                                options={opcoesAutocomplete}
                                value={
                                    produtoSelecionado
                                        ? { label: produtoSelecionado.nome, value: produtoSelecionado.id }
                                        : null
                                }
                                inputValue={inputValue}
                                onInputChange={(_, v) => setInputValue(v)}
                                onChange={(_, opt) => {
                                    if (!opt) {
                                        setProdutoSelecionado(null);
                                        return;
                                    }
                                    const p = catalogo.find(c => c.id === opt.value) || null;
                                    setProdutoSelecionado(p);
                                    setInputValue('');
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
                                    minWidth: { xs: '100%', sm: 140 },
                                    height: 56,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Adicionar
                            </Button>
                        </Stack>
                    </Box>

                    {/* Itens da lista – ainda dentro do mesmo Paper */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                            Itens da lista
                        </Typography>

                        <List
                            disablePadding
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                overflow: 'hidden',
                            }}
                        >
                            {listaItens.length === 0 && (
                                <Typography color="text.secondary" sx={{ p: 2 }}>
                                    Sua lista está vazia. Adicione itens acima ou use um modelo rápido.
                                </Typography>
                            )}

                            {listaItens.map((li, idx) => {
                                const riscos = patPorProduto.get(li.produto.id) || [];
                                const hasRisk = riscos.length > 0;

                                return (
                                    <ListItem
                                        key={li.produto.id}
                                        sx={(theme) => ({
                                            px: 2,
                                            height: 60, // 🔹 mesma altura pra todo mundo
                                            alignItems: 'center',
                                            borderBottom:
                                                idx < listaItens.length - 1
                                                    ? `1px solid ${theme.palette.divider}`
                                                    : 'none',
                                            ...(hasRisk && {
                                                borderLeft: `3px solid ${theme.palette.warning.main}`,
                                                backgroundColor: theme.palette.action.hover,
                                            }),
                                        })}
                                        secondaryAction={
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => decQtd(li.produto.id)}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>

                                                <Typography
                                                    variant="body2"
                                                    sx={{ minWidth: 18, textAlign: 'center' }}
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
                                        {/* Ícone de risco (mesma altura, info completa só no tooltip) */}
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
                                                                    • {r.patologia.nome}{' '}
                                                                    {r.nivel ? `(${r.nivel})` : ''}
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    }
                                                >
                                                    <WarningAmberIcon color="warning" fontSize="small" />
                                                </Tooltip>
                                            </ListItemIcon>
                                        ) : (
                                            <ListItemIcon sx={{ minWidth: 30 }} />
                                        )}

                                        {/* Conteúdo principal */}
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography fontWeight={600}>{li.produto.nome}</Typography>

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

            <Stack direction="row" justifyContent={'end'} spacing={1} sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Salvar como rascunho
                </Button>
                <Button variant="contained" startIcon={<RecommendIcon />}>
                    Finalizar lista
                </Button>
            </Stack>

            <Snackbar
                open={warnOpen}
                autoHideDuration={7000}
                onClose={() => setWarnOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setWarnOpen(false)} severity="warning" variant="filled" sx={{ width: '100%' }}>
                    {warnMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}
