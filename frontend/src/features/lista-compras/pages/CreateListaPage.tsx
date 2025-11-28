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
    PatologiaItem, ProdutoSubstituivel,
} from '../types';
import { listaComprasService } from '../api/service/listaComprasService.ts';
import {listaViewService} from "@/features/lista-compras/api/service/listaViewService.ts";
import {patologiasService} from "@/features/lista-compras/api/service/patologiaService.ts";
import {produtoService} from "@/features/lista-compras/api/service/produtoService.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const normalize = (s: string) => s.trim().toLowerCase();
const userIdTemp = 1 //TODO remover todas referencias de userIdTemp para a que irá retornar do usuário logado

export default function CreateListaPage() {
    const navigate = useNavigate();

    const [catalogo, setCatalogo] = useState<Produto[]>([]);
    const [listaItens, setListaItens] = useState<ListaItemVM[]>([]);

    const [templates, setTemplates] = useState<Template[]>([]);

    const [inputValue, setInputValue] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [opcoesAutocomplete, setOpcoesAutocomplete] = useState<
        { label: string; value: number }[]
    >([]);

    const [riscosPorProduto, setRiscosPorProduto] = useState<Record<number, ProdutoSubstituivel[]>>({});


    const [patologias, setPatologias] = useState<Patologia[]>([]);
    const [loadingPats, setLoadingPats] = useState(false);

    // snackbar de alerta por patologia
    const [warnOpen, setWarnOpen] = useState(false);
    const [warnMsg, setWarnMsg] = useState('');

    const [tituloLista, setTituloLista] = useState('');

    const [saving, setSaving] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [successOpen, setSuccessOpen] = useState(false);

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setErrorOpen(true);
    };

    const templatesForDisplay = useMemo(() => {
        // 🔹 mocks só pra teste visual de scroll
        const mocks: Template[] = [
            { id: -101, titulo: 'Lista - Festa de Aniversário' } as Template,
            { id: -102, titulo: 'Lista - Churrasco de Fim de Semana' } as Template,
            { id: -103, titulo: 'Lista - Almoço de Domingo' } as Template,
            { id: -104, titulo: 'Lista - Semana Saudável' } as Template,
            { id: -105, titulo: 'Lista - Café da Manhã Reforçado' } as Template,
            { id: -106, titulo: 'Lista - Compras do Mês' } as Template,
            { id: -107, titulo: 'Lista - Jantar Romântico' } as Template,
            { id: -108, titulo: 'Lista - Lanche das Crianças' } as Template,
        ];

        // se vier vazio do backend, usa só mocks
        if (templates.length === 0) {
            return mocks;
        }

        // se vier poucos, completa com alguns mocks para testar visual
        if (templates.length < 8) {
            const faltam = 8 - templates.length;
            return [...templates, ...mocks.slice(0, faltam)];
        }

        // se já tiver bastante template real, usa só os reais
        return templates;
    }, [templates]);

    const carregouRef = useRef(false);

    useEffect(() => {
        if (carregouRef.current) return;
        carregouRef.current = true;
        const loadInicial = async () => {
            try {

                setLoadingPats(true);
                const pats = await patologiasService.getPatologiasDoUsuario(userIdTemp);
                setPatologias(pats);
                setLoadingPats(false);

                const tpls = await listaViewService.listarTemplates(userIdTemp);
                setTemplates(tpls);


            } catch (e) {
                showError('Erro ao carregar dados iniciais da lista de compras');
                console.error('Erro ao carregar dados iniciais da lista de compras', e);
            }
        };

        loadInicial();
    }, []);

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

    };



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

            const listaCriada = await listaComprasService.criarLista(payload, userIdTemp);
            resetState()
            setSuccessOpen(true);

        } catch (e) {
            showError('Erro ao carregar dados iniciais da lista de compras. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };


    const handleAdicionar = async () => {
        const texto = (produtoSelecionado?.nome || inputValue).trim();
        if (!texto) return;

        const p = produtoSelecionado ?? ensureProduto(texto);
        addProdutoNaLista(p, 1);
        setProdutoSelecionado(null);
        setInputValue('');

        if (p.id > 0) {
            try {
                const substituiveis = await produtoService.listarSubstituiveis(p.id, userIdTemp);

                if (substituiveis.length > 0) {
                    // Guarda no estado de riscos
                    setRiscosPorProduto(prev => ({
                        ...prev,
                        [p.id]: substituiveis,
                    }));

                    // Monta a mensagem global de alerta
                    const nomesPats = Array.from(new Set(substituiveis.map(s => s.patologia.nome))).join(', ');
                    setWarnMsg(
                        `Atenção: "${p.nome}" pode não ser adequado para: ${nomesPats}. ` +
                        `Veja as sugestões na lista.`
                    );
                    setWarnOpen(true);
                }
            } catch (e) {
                console.error('Erro ao buscar substituíveis para produto', p, e);
                // pode ou não mostrar erro pro usuário, fica a seu critério
            }
        }

    };

    const substituirProdutoNaLista = (produtoId: number, sugestao: Produto) => {
        setListaItens(prev =>
            prev.map(li =>
                li.produto.id === produtoId
                    ? { ...li, produto: sugestao }
                    : li
            )
        );

        setCatalogo(prev => {
            const exists = prev.some(p => p.id === sugestao.id);
            return exists ? prev : [sugestao, ...prev];
        });

        setRiscosPorProduto(prev => {
            const clone = { ...prev };
            delete clone[produtoId];
            return clone;
        });

        // opcional: checar riscos do produto sugerido
        // checarRiscos(sugestao);
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
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: 'none', height: 40 }}
                >
                    Voltar
                </Button>
            </Stack>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems="flex-start" // <-- garante alinhamento pelo topo
                sx={{ mb: 2 }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1 }}>
                        Criar Nova Lista de Compras
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Monte sua lista adicionando itens ou use um modelo pronto.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/lista-compras/listas')}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        height: 42,
                        mt: { xs: 2, sm: 0 }, // em mobile desce, em desktop alinha pelo topo
                    }}
                >
                    Minhas listas
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
                            alignItems="flex-start"
                            justifyContent="space-between"
                            spacing={2}
                        >

                            <Box
                                sx={(theme) => ({
                                    flex: 1,
                                    maxWidth: '70%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center', // 🔥 nada de stretch aqui
                                    overflowX: 'auto',
                                    gap: 1.25,
                                    py: 1.25,
                                    px: 1.25,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
                                    '&::-webkit-scrollbar': {
                                        height: 6,
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        borderRadius: 999,
                                        backgroundColor: 'rgba(0,0,0,0.20)',
                                    },
                                })}
                            >
                                {templates.map((t) => (
                                    <Card
                                        key={t.id}
                                        elevation={0}
                                        sx={{
                                            flex: '0 0 210px',   // 🔹 um pouco mais estreito e uniforme
                                            maxWidth: 210,
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: 'background.paper',
                                            transition:
                                                'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: 2,
                                                borderColor: 'primary.light',
                                            },
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() => copiarTemplate(t)}
                                            sx={{
                                                px: 1.25,
                                                py: 0.75,              // 🔹 mais compacto
                                            }}
                                        >
                                            <Stack direction="row" spacing={1.25} alignItems="center">
                                                <Box
                                                    sx={{
                                                        width: 26,
                                                        height: 26,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.light',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,        // 🔥 nunca deforma
                                                    }}
                                                >
                                                    <ContentCopyIcon
                                                        sx={{ color: 'white', fontSize: 16 }}
                                                    />
                                                </Box>

                                                <Typography
                                                    fontWeight={600}
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {t.titulo}
                                                </Typography>
                                            </Stack>
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </Box>

                            {/* Botão limpar lista */}
                            <Button
                                variant="outlined"
                                color="error"
                                sx={{
                                    height: 40,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
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
                                const riscos = riscosPorProduto[li.produto.id] ?? [];
                                const hasRisk = riscos.length > 0;
                                const primeiraSugestao = riscos[0]?.produtoSugestao;

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
                                                {/* 🔸 NOVO: botão de trocar pelo sugerido, se tiver risco */}
                                                {hasRisk && primeiraSugestao && (
                                                    <Tooltip title={`Trocar por ${primeiraSugestao.nome}`}>
                                                        <IconButton
                                                            size="small"
                                                            color="warning"
                                                            onClick={() =>
                                                                substituirProdutoNaLista(li.produto.id, {
                                                                    id: primeiraSugestao.id,
                                                                    nome: primeiraSugestao.nome,
                                                                    nome_normalizado:
                                                                        primeiraSugestao.nomeNormalizado?.toLowerCase().trim() ??
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

                                                {/* 🔹 TUDO ABAIXO JÁ EXISTIA IGUALZINHO */}
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
                                                                    • {r.patologia.nome} — sugerido: <b>{r.produtoSugestao.nome}</b>
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
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => navigate('/lista-compras')}
                    disabled={saving}
                    sx={{ textTransform: 'none' }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleFinalizarLista}
                    startIcon={<CheckCircleIcon />}
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
