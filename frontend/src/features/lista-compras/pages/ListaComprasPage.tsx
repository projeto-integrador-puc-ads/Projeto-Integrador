import { Box, Typography } from '@mui/material';
import { ModuleCard } from '@/components/ModuleCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RecommendIcon from '@mui/icons-material/Recommend';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import FileCopyIcon from '@mui/icons-material/FileCopy';


export default function ListaComprasPage() {
    const navigate = useNavigate();

    const items = [
        {
            icon: <AddCircleOutlineIcon sx={{ fontSize: 40 }} />,
            title: 'Criar nova lista',
            desc: 'Comece do zero e adicione itens.',
            to: '/lista-compras/nova',
        },
        {
            icon: <ListAltIcon sx={{ fontSize: 40 }} />,
            title: 'Minhas listas',
            desc: 'Veja, edite e compartilhe suas listas.',
            to: '/lista-compras/listas',
        },

        {
            icon: <FileCopyIcon sx={{ fontSize: 40 }} />,
            title: 'Templates',
            desc: 'Crie Templates de listas.',
            to: '/lista-compras/templates',
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Lista de Compras
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Escolha uma opção para continuar.
            </Typography>

            {/* mesmo layout do seu ModuleGrid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '1fr 1fr 1fr',
                    },
                    gap: 2,
                }}
            >
                {items.map((m) => (
                    <ModuleCard
                        key={m.title}
                        icon={m.icon}
                        title={m.title}
                        description={m.desc}
                        onClick={() => navigate(m.to)}
                    />
                ))}
            </Box>
        </Box>
    );
}
