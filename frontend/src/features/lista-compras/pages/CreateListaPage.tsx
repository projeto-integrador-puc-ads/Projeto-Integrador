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

import type {
    Produto,
    ListaItemVM,
    Template,
    Patologia,
    PatologiaItem,
} from '../types';
import { listaComprasService } from '../api/service/listaComprasService.ts';
import {listaViewService} from "@/features/lista-compras/api/service/listaViewService.ts";
import {patologiasService} from "@/features/lista-compras/api/service/patologiaService.ts";

/** normalização simples */
const normalize = (s: string) => s.trim().toLowerCase();

/** ======================= Página ======================= */
export default function CreateListaPage() {
    const navigate = useNavigate();

    // catálogo / lista
    const [catalogo, setCatalogo] = useState<Produto[]>([]);
    const [listaItens, setListaItens] = useState<ListaItemVM[]>([]);

    // templates
    const [templates, setTemplates] = useState<Template[]>([]);

    // autocomplete
    const [inputValue, setInputValue] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [opcoesAutocomplete, setOpcoesAutocomplete] = useState<
        { label: string; value: number }[]
    >([]);

    // snack recomendação
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState('');
    const snackProdutoSugeridoRef = useRef<Produto | null>(null);

    // patologias do usuário (mock da integração)
    const [patologias, setPatologias] = useState<Patologia[]>([]);
    const [loadingPats, setLoadingPats] = useState(false);

    const [patologiaItens, setPatologiaItens] = useState<PatologiaItem[]>([]);

    // snackbar de alerta por patologia
    const [warnOpen, setWarnOpen] = useState(false);
    const [warnMsg, setWarnMsg] = useState('');

    const [tituloLista, setTituloLista] = useState('');

    const [saving, setSaving] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [successOpen, setSuccessOpen] = useState(false);

    // índices úteis
    const produtosPorId = useMemo(() => {
        const map = new Map<number, Produto>();
        catalogo.forEach(p => map.set(p.id, p));
        return map;
    }, [catalogo]);

    const itensIdsNaLista = useMemo(
        () => new Set(listaItens.map(li => li.produto.id)),
        [listaItens]
    );

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setErrorOpen(true);
    };

    // índice produto_id -> [patologias que disparam]
    const patPorProduto = useMemo(() => {
        const byProd = new Map<number, { patologia: Patologia; nivel: 'baixa' | 'media' | 'alta' }[]>();

        for (const pi of patologiaItens) {
            const pat = patologias.find(p => p.id === pi.patologia_id);
            if (!pat) continue; // só consideramos patologias do usuário

            const arr = byProd.get(pi.produto_id) || [];
            arr.push({ patologia: pat, nivel: (pi.nivel as any) || 'media' });
            byProd.set(pi.produto_id, arr);
        }

        return byProd;
    }, [patologias, patologiaItens]);

    // carregar dados iniciais "da API"
    useEffect(() => {
        const loadInicial = async () => {
            try {

                setLoadingPats(true);
                const pats = await patologiasService.getPatologiasDoUsuario(3);
                setPatologias(pats);
                setLoadingPats(false);

                const produtos = await listaComprasService.getProdutos();
                setCatalogo(produtos);

                const tpls = await listaViewService.listarTemplates(3);
                setTemplates(tpls);


            } catch (e) {
                showError('Erro ao carregar dados iniciais da lista de compras');
                console.error('Erro ao carregar dados iniciais da lista de compras', e);
            }
        };

        loadInicial();
    }, []);

    // autocomplete batendo na “API” a partir de 3 letras (com debounce)
    useEffect(() => {
        if (inputValue.trim().length < 3) {
            setOpcoesAutocomplete([]);
            return;
        }

        let ativo = true;
        const handler = setTimeout(async () => {
            try {
                const produtos = await listaComprasService.searchProdutosByNome(inputValue);
                if (!ativo) return;

                setOpcoesAutocomplete(
                    produtos.map(p => ({
                        label: p.nome,
                        value: p.id,
                    }))
                );
            } catch (e) {
                showError('Erro ao buscar produtos para autocomplete.');
            }
        }, 300);

        return () => {
            ativo = false;
            clearTimeout(handler);
        };
    }, [inputValue]);

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

    const handleLimparLista = () => {
        setListaItens([]);
        setProdutoSelecionado(null);
        setInputValue('');
    };

    const resetState = () => {
        setTituloLista('');
        setListaItens([]);
        setProdutoSelecionado(null);
        setInputValue('');
        setOpcoesAutocomplete([]);
    }

    const handleFinalizarLista = async () => {
        if (saving) return;
        const titulo = tituloLista.trim();

        if (!titulo) {
            showError('Informe um título para a lista.');
            return;
        }

        if (listaItens.length === 0) {
            showError('Adicione ao menos um item na lista.');
            return;
        }

        // ⚠️ Por enquanto só envia itens com ID > 0 (existem no backend)
        const itensValidos = listaItens.filter(li => li.produto.id > 0);

        if (itensValidos.length === 0) {
            showError('Não há itens válidos para salvar (apenas personalizados locais).');
            return;
        }

        const payload = {
            titulo,
            itens: itensValidos.map(li => ({
                produtoId: li.produto.id,
                qtd: li.qtd,
            })),
        };

        try {
            setSaving(true);
            const userId = 3;            // TODO: substituir 1 pelo userId real quando estiver integrado

            const listaCriada = await listaComprasService.criarLista(payload, userId);
            resetState()
            setSuccessOpen(true);

        } catch (e) {
            showError('Erro ao carregar dados iniciais da lista de compras. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const simulateFetchRecomendacao = (base: Produto) => {
        setTimeout(async () => {
            try {
                const candidatos = await listaComprasService.getRelacionadosOuPopulares(base.id);

                const candidato = candidatos.find(
                    p => !itensIdsNaLista.has(p.id) && p.id !== base.id
                );

                if (candidato) {
                    snackProdutoSugeridoRef.current = candidato;
                    setSnackMsg(`Recomendação: adicionar também "${candidato.nome}"?`);
                    setSnackOpen(true);
                }
            } catch (e) {
                console.error('Erro ao buscar recomendação', e);
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
        if (!tpl.itens || tpl.itens.length === 0) {
            showError('Este modelo não possui itens cadastrados.');
            return;
        }

        setListaItens(prev => {

            const map = new Map<number, { produto: Produto; qtd: number }>();

            prev.forEach(li => {
                map.set(li.produto.id, { produto: li.produto, qtd: li.qtd });
            });

            // 2) Adiciona (ou soma) os itens do template
            tpl.itens.forEach(it => {
                const pApi = it.produto;

                // Converte o produto do backend para o tipo Produto usado no front
                const produto: Produto = {
                    id: pApi.id,
                    nome: pApi.nome,
                    nome_normalizado:
                        pApi.nomeNormalizado?.toLowerCase().trim()
                        ?? pApi.nome.toLowerCase().trim(),
                    ativo: pApi.ativo ?? true,
                    is_personalizado: pApi.isPersonalizado ?? false,
                };

                const qtdTemplate = Number(it.quantidade ?? 1);
                const existente = map.get(produto.id);

                if (existente) {
                    // Se já existe na lista, soma as quantidades
                    map.set(produto.id, {
                        produto: existente.produto,
                        qtd: existente.qtd + qtdTemplate,
                    });
                } else {
                    map.set(produto.id, { produto, qtd: qtdTemplate });
                }
            });

            // 3) Atualiza também o catálogo pra garantir que todos produtos do template estão lá
            setCatalogo(old => {
                const ids = new Set(old.map(p => p.id));
                const extras: Produto[] = [];
                map.forEach(({ produto }) => {
                    if (!ids.has(produto.id)) {
                        extras.push(produto);
                    }
                });
                return [...old, ...extras];
            });

            // 4) Retorna a nova lista de itens (ListaItemVM[])
            return Array.from(map.values());
        });
    };

    const incQtd = (id: number) =>
        setListaItens(prev => prev.map(li => (li.produto.id === id ? { ...li, qtd: li.qtd + 1 } : li)));

    const decQtd = (id: number) =>
        setListaItens(prev =>
            prev.map(li => (li.produto.id === id ? { ...li, qtd: Math.max(1, li.qtd - 1) } : li))
        );

    const remover = (id: number) =>
        setListaItens(prev => prev.filter(li => li.produto.id !== id));

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    size={'small'}
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: 'none', height: 40 }}
                >
                    Voltar
                </Button>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Criar Nova Lista de Compras
            </Typography>
            <Typography color="text.secondary">
                Monte sua lista adicionando itens ou use um modelo pronto.
            </Typography>

            <TextField
                sx={{ mt: 3 }}
                fullWidth
                label="Título da lista"
                placeholder="Ex: Compras da semana"
                value={tituloLista}
                onChange={(e) => setTituloLista(e.target.value)}
            />
            {/* Patologias do usuário */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 3 }}>
                {patologias.length === 0 ? (
                    <Typography color="text.secondary">
                        Nenhuma condição carregada ainda.
                    </Typography>
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

            {/* Templates + Adicionar itens + Lista, tudo dentro do mesmo Paper */}
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
                    {/* Modelos rápidos */}
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
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: 50,
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                    gap: 1.5,
                                }}
                            >
                                {templates.map((t) => (
                                    <Card
                                        key={t.id}
                                        elevation={0}
                                        sx={{
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            transition:
                                                'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s',
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
                                                    <Typography
                                                        fontWeight={600}
                                                        variant="body2"
                                                        sx={{ fontSize: '0.9rem' }}
                                                    >
                                                        {t.titulo}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </Box>

                            <Button
                                variant="outlined"
                                color="error"
                                sx={{
                                    height: 40,
                                }}
                                onClick={handleLimparLista}
                                disabled={saving}
                            >
                                Limpar lista
                            </Button>

                        </Stack>
                    </Box>

                    {/* Campo de adição */}
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

                                    let p = catalogo.find(c => c.id === opt.value) || null;

                                    if (!p) {
                                        p = {
                                            id: opt.value,
                                            nome: opt.label,
                                            nome_normalizado: opt.label.toLowerCase(),
                                            ativo: true,
                                            is_personalizado: false,
                                        };
                                        setCatalogo(prev => [p!, ...prev]);
                                    }

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

                    {/* Itens da lista */}
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
                                            height: 60,
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

                                        <ListItemText
                                            primary={
                                                <Stack direction="row" spacing={1} alignItems="center">
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

            <Stack direction="row" justifyContent={'end'} spacing={1} sx={{ mt: 3 }}>
                {/*<Button variant="outlined" onClick={() => navigate(-1)}>*/}
                {/*    Salvar como rascunho*/}
                {/*</Button>*/}
                <Button
                    variant="contained"
                    onClick={handleFinalizarLista}
                    startIcon={<RecommendIcon />}
                    disabled={saving || listaItens.length === 0}
                >
                    {saving ? 'Salvando...' : 'Finalizar lista'}
                </Button>
            </Stack>

            <Snackbar
                open={warnOpen}
                autoHideDuration={7000}
                onClose={() => setWarnOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setWarnOpen(false)}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {warnMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={successOpen}
                autoHideDuration={4000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSuccessOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Lista criada com sucesso!
                </Alert>
            </Snackbar>

            <Snackbar
                open={errorOpen}
                autoHideDuration={6000}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setErrorOpen(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}
