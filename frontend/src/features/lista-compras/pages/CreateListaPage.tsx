import { useMemo, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
    Button,
    Card,
    CardActionArea,
    CardContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Stack,
    Snackbar,
    Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RecommendIcon from '@mui/icons-material/Recommend';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

/** ==== Tipos mockados, alinhados ao banco ==== */
type Produto = {
    id: number;
    nome: string;
    nome_normalizado: string;
    ativo: boolean;
    is_personalizado: boolean;
};

type ListaItemVM = { produto: Produto; qtd: number };
type Template = {
    id: number;
    titulo: string;
    is_template: boolean;
    itens: { produto_id: number; qtd: number }[];
};

/** ==== MOCKS ==== */
const mockProdutos: Produto[] = [
    { id: 1, nome: 'Leite', nome_normalizado: 'leite', ativo: true, is_personalizado: false },
    { id: 2, nome: 'Café', nome_normalizado: 'cafe', ativo: true, is_personalizado: false },
    { id: 3, nome: 'Filtro de Papel', nome_normalizado: 'filtro de papel', ativo: true, is_personalizado: false },
    { id: 4, nome: 'Arroz', nome_normalizado: 'arroz', ativo: true, is_personalizado: false },
    { id: 5, nome: 'Feijão', nome_normalizado: 'feijao', ativo: true, is_personalizado: false },
    { id: 6, nome: 'Pão Integral', nome_normalizado: 'pao integral', ativo: true, is_personalizado: false },
];

const mockTemplates: Template[] = [
    {
        id: 101,
        titulo: 'Café da Manhã',
        is_template: true,
        itens: [
            { produto_id: 1, qtd: 1 },
            { produto_id: 2, qtd: 1 },
            { produto_id: 6, qtd: 1 },
        ],
    },
    {
        id: 102,
        titulo: 'Feira da Semana',
        is_template: true,
        itens: [
            { produto_id: 4, qtd: 1 },
            { produto_id: 5, qtd: 1 },
        ],
    },
];

const mockRelacionados: Record<number, number[]> = {
    2: [3],
    4: [5],
    1: [6, 2],
};
const mockPopulares: number[] = [4, 5, 1, 2, 6];
const normalize = (s: string) => s.trim().toLowerCase();

/** ======================= */
export default function CreateListaPage() {
    const [catalogo, setCatalogo] = useState<Produto[]>(mockProdutos);
    const [listaItens, setListaItens] = useState<ListaItemVM[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState('');
    const snackProdutoSugeridoRef = useRef<Produto | null>(null);

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
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                🛒 Criar Nova Lista de Compras
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Monte sua lista adicionando itens ou use um modelo pronto.
            </Typography>

            {/* Templates */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Modelos rápidos
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mb: 3,
                }}
            >
                {mockTemplates.map(t => (
                    <Card
                        key={t.id}
                        elevation={2}
                        sx={{
                            borderRadius: 2,
                            transition: 'transform 0.2s ease',
                            '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
                        }}
                    >
                        <CardActionArea onClick={() => copiarTemplate(t)} sx={{ p: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.light',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ContentCopyIcon sx={{ color: 'primary.main' }} />
                                </Box>
                                <Box>
                                    <Typography fontWeight={600}>{t.titulo}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Clique para copiar este modelo
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>

            {/* Campo de adição */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: '#fafafa',
                }}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Autocomplete
                        fullWidth
                        options={opcoesAutocomplete}
                        value={produtoSelecionado ? { label: produtoSelecionado.nome, value: produtoSelecionado.id } : null}
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
                        sx={{ px: 3, minWidth: 140, height: 56 }}
                    >
                        Adicionar
                    </Button>
                </Stack>
            </Paper>

            {/* Itens da lista */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Itens da lista
            </Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                {listaItens.length === 0 && (
                    <Typography color="text.secondary" sx={{ p: 2 }}>
                        Sua lista está vazia. Adicione itens acima ou escolha um modelo pronto.
                    </Typography>
                )}
                {listaItens.map((li, idx) => (
                    <Box key={li.produto.id}>
                        <ListItem
                            secondaryAction={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <IconButton size="small" onClick={() => decQtd(li.produto.id)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography width={24} textAlign="center">
                                        {li.qtd}
                                    </Typography>
                                    <IconButton size="small" onClick={() => incQtd(li.produto.id)}>
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => remover(li.produto.id)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Stack>
                            }
                        >
                            <ListItemText
                                primary={<Typography fontWeight={600}>{li.produto.nome}</Typography>}
                                secondary={li.produto.is_personalizado ? 'Item personalizado' : undefined}
                            />
                        </ListItem>
                        {idx < listaItens.length - 1 && <Divider />}
                    </Box>
                ))}
            </List>

            {/* Ações */}
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                <Button variant="outlined">Salvar como rascunho</Button>
                <Button variant="contained" startIcon={<RecommendIcon />}>
                    Finalizar lista
                </Button>
            </Stack>

            {/* Snackbar de recomendação */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={() => setSnackOpen(false)}
                message={snackMsg}
                action={
                    <Button
                        color="secondary"
                        size="small"
                        onClick={() => {
                            const sug = snackProdutoSugeridoRef.current;
                            if (sug) addProdutoNaLista(sug, 1);
                            setSnackOpen(false);
                        }}
                    >
                        Adicionar
                    </Button>
                }
            />
        </Box>
    );
}
