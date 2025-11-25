import React from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Medicamento } from '../types/medicamento';

interface HistoricoMedicamentosProps {
    historico: Medicamento[];
}

const HistoricoMedicamentos: React.FC<HistoricoMedicamentosProps> = ({
    historico,
}) => {
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
                    Histórico de Medicamentos
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button component={Link} to="/medicamentos/lista" variant="outlined">
                        📋 Lista
                    </Button>
                </Stack>
            </Stack>

            {historico.length === 0 ? (
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
                        Nenhuma ação registrada
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        O histórico aparecerá aqui quando adicionar ou editar medicamentos.
                    </Typography>
                </Box>
            ) : (
                historico.map((item) => (
                    <Card
                        key={item.id || item.nome}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            '&amp;&amp;:hover': { boxShadow: 4 },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                {item.nome}
                            </Typography>

                            {item.dataInicio && item.dataFim ? (
                                <Typography variant="body2" color="text.secondary">
                                    Período: {item.dataInicio} → {item.dataFim} às{' '}
                                    {item.horarioMedicamento}
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    {item.dataMedicamento
                                        ? `Data: ${item.dataMedicamento} às ${item.horarioMedicamento}`
                                        : `Horário: ${item.horarioMedicamento}`}
                                </Typography>
                            )}

                            <Typography variant="body2" color="text.secondary">
                                Tarja: {item.tarja.toUpperCase()} | Dosagem: {item.dosagem} |{' '}
                                Quantidade: {item.quantidade}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default HistoricoMedicamentos;
