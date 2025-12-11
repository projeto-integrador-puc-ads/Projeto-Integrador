import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Stack,
    Tabs,
    Tab,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Paper
} from '@mui/material';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Ícone da Conquista
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Componentes das listas
import DiariosPage from './DiariosPage';
import LembrancasPage from './LembrancasPage';
import ConquistasUsuarioPage from './ConquistasUsuarioPage';

// Componentes dos Modais
import DiarioModal from '../components/DiarioModal';
import LembrancaModal from '../components/LembrancaModal';
import ConquistaDesbloqueadaModal from '../components/ConquistaDesbloqueadaModal'; // NOVO

import type {Conquista} from '../api/conquistas'; // NOVO
// NOVO

export default function RememberPage() {
    // Estado da aba (0 = Diários, 1 = Lembranças, 2 = Conquistas)
    const [tabIndex, setTabIndex] = useState(0);

    // Estado do Menu do botão "Novo"
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    // --- ESTADOS DOS MODAIS DE CRIAÇÃO ---
    const [openDiarioModal, setOpenDiarioModal] = useState(false);
    const [openLembrancaModal, setOpenLembrancaModal] = useState(false);

    // --- ESTADOS DA CELEBRAÇÃO (CONQUISTAS) ---
    const [openFestaModal, setOpenFestaModal] = useState(false);
    const [conquistaGanha, setConquistaGanha] = useState<Conquista | null>(null);

    // --- ESTADOS DE REFRESH (Para recarregar as listas após salvar) ---
    const [refreshDiariosKey, setRefreshDiariosKey] = useState(0);
    const [refreshLembrancasKey, setRefreshLembrancasKey] = useState(0);

    // ID do Usuário (Simulado ou vindo de Contexto)
    const usuarioIdLogado = 1;

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    // --- LÓGICA DO MENU ---
    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // --- AÇÕES DE ABERTURA ---

    const handleNovoDiario = () => {
        handleCloseMenu();
        setOpenDiarioModal(true);
    };

    const handleNovaLembranca = () => {
        handleCloseMenu();
        setOpenLembrancaModal(true);
    };

    // --- LÓGICA DE EXIBIÇÃO DE CONQUISTA ---
    const handleMostrarConquista = (lista: Conquista[]) => {
        if (lista && lista.length > 0) {
            // Pega a primeira conquista para exibir (simplificação)
            setConquistaGanha(lista[0]);
            setOpenFestaModal(true);
        }
    };

    // --- CALLBACKS DE SUCESSO ---

    const handleDiarioSalvo = () => {
        setRefreshDiariosKey((prev) => prev + 1);
        setTabIndex(0);
    };

    const handleLembrancaSalva = () => {
        setRefreshLembrancasKey((prev) => prev + 1);
        setTabIndex(1);
    };

    return (
        <Container sx={{ py: 4 }}>

            {/* 1. CABEÇALHO GERAL */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                mb={3}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <HistoryEduIcon color="primary" sx={{ fontSize: 60 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            Meu Diário Cognitivo
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mt: 0.5 }}>
                            Um espaço dedicado para você eternizar suas vivências.
                            A escrita diária fortalece sua memória e celebra sua história de vida.
                        </Typography>
                    </Box>
                </Stack>

                {/* BOTÃO NOVO COM MENU */}
                <Box>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        endIcon={<ExpandMoreIcon />}
                        onClick={handleOpenMenu}
                    >
                        Novo Registro
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                        PaperProps={{ sx: { minWidth: 180 } }}
                    >
                        <MenuItem onClick={handleNovoDiario}>
                            <ListItemIcon><MenuBookIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Escrever Diário</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleNovaLembranca}>
                            <ListItemIcon><AutoAwesomeIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Criar Lembrança</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Stack>

            {/* 2. SISTEMA DE ABAS */}
            <Paper square elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'transparent' }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    aria-label="Abas do Diário Cognitivo"
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Meus Diários" icon={<MenuBookIcon />} iconPosition="start" />
                    <Tab label="Minhas Lembranças" icon={<AutoAwesomeIcon />} iconPosition="start" />
                    <Tab label="Minhas Conquistas" icon={<EmojiEventsIcon />} iconPosition="start" />
                </Tabs>
            </Paper>

            {/* 3. CONTEÚDO DA ABA SELECIONADA */}
            <Box sx={{ py: 3 }}>
                {tabIndex === 0 && (
                    <DiariosPage
                        key={refreshDiariosKey}
                        usuarioId={usuarioIdLogado}
                    />
                )}

                {tabIndex === 1 && (
                    <LembrancasPage
                        key={refreshLembrancasKey}
                        usuarioId={usuarioIdLogado}
                    />
                )}

                {tabIndex === 2 && (
                    <ConquistasUsuarioPage usuarioId={usuarioIdLogado} />
                )}
            </Box>

            {/* 4. MODAIS (Invisíveis até serem ativados) */}

            <DiarioModal
                open={openDiarioModal}
                onClose={() => setOpenDiarioModal(false)}
                onSuccess={handleDiarioSalvo}
                usuarioId={usuarioIdLogado}
                onConquistaGanhas={handleMostrarConquista} // Passa o callback
            />

            <LembrancaModal
                open={openLembrancaModal}
                onClose={() => setOpenLembrancaModal(false)}
                onSuccess={handleLembrancaSalva}
                usuarioId={usuarioIdLogado}
                onConquistaGanhas={handleMostrarConquista} // Passa o callback
            />

            {/* 5. MODAL DE CELEBRAÇÃO 🎉 */}
            <ConquistaDesbloqueadaModal
                open={openFestaModal}
                onClose={() => setOpenFestaModal(false)}
                conquista={conquistaGanha}
            />

        </Container>
    );
}