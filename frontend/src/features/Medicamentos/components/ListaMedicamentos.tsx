import React from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import type { Medicamento } from '../types/medicamento';

interface ListaMedicamentosProps {
    medicamentos: Medicamento[];
    setMedParaEditar: (med: Medicamento) => void;
}

const ListaMedicamentos: React.FC<ListaMedicamentosProps> = ({
    medicamentos,
    setMedParaEditar,
}) => {
    const navigate = useNavigate();

    const handleEditar = (med: Medicamento) => {
        setMedParaEditar(med);
        navigate('/medicamentos/cadastro');
    };

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: 'auto',
                my: 5,
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 3,
                boxShadow: 3,
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h5" color="primary" fontWeight={700}>
                    Medicamentos Cadastrados
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        component={Link}
                        to="/medicamentos/historico"
                        variant="outlined"
                    >
                        🕒 Histórico
                    </Button>
                    <Button
                        component={Link}
                        to="/medicamentos/cadastro"
                        variant="contained"
                    >
                        + Novo
                    </Button>
                </Stack>
            </Stack>

            {medicamentos.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 6,
                        border: '2px dashed #90caf9',
                        borderRadius: '16px',
                        backgroundColor: '#e3f2fd',
                        color: 'primary.main',
                    }}
                >
                    <Typography variant="h4" mb={1}>
                        💊
                    </Typography>
                    <Typography variant="h6" mb={1}>
                        Nenhum medicamento cadastrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Comece cadastrando seu primeiro medicamento para gerenciar seus horários.
                    </Typography>
                    <Button
                        component={Link}
                        to="/medicamentos/cadastro"
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        + Cadastrar Medicamento
                    </Button>
                </Box>
            ) : (
                medicamentos.map((med, index) => (
                    <Card
                        key={med.id || index}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            '&amp;:hover': { boxShadow: 4, transform: 'scale(1.01)' },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                {med.nome} — {med.dosagem} — {med.quantidade} unidades
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                ⏰ {med.horarioMedicamento} · 📅 {med.dataMedicamento}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ☎️ Contato: {med.contatoEmergencia}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() => handleEditar(med)}
                            >
                                Editar
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default ListaMedicamentos;
