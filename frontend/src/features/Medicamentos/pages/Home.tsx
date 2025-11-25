import React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Stack,
    Card,
    CardContent,
    Container,
} from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';

const Home: React.FC = () => {
    return (
        <Container
            maxWidth="md"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 64px)',
                backgroundColor: 'transparent',
                py: 4,
            }}
        >
            <Card
                sx={{
                    backgroundColor: 'transparent',
                    border: '2px solid rgba(0,0,0,0.08)', //contorno suave
                    borderRadius: '22px',
                    boxShadow: 'none',
                    textAlign: 'center',
                    padding: { xs: '30px 20px', sm: '50px 40px' },
                    maxWidth: 500,
                    width: '90%',
                    transition: 'transform 0.2s ease',
                    '&amp;:hover': {
                        transform: 'scale(1.02)',
                        borderColor: 'primary.main',
                    },
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2rem' },
                            color: 'primary.main',
                            fontWeight: 'bold',
                            mb: 1,
                        }}
                    >
                        💊 DoseCerta
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: '#37474f',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            mb: 4,
                            lineHeight: 1.5,
                        }}
                    >
                        Seu assistente simples e inteligente para lembrar dos medicamentos.
                    </Typography>

                    <Stack spacing={3}>
                        <Button
                            component={Link}
                            to="/medicamentos/cadastro"
                            variant="outlined"
                            color="primary"
                            size="large"
                            startIcon={<MedicationIcon />}
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.2rem' },
                                fontWeight: 'bold',
                                borderRadius: 2,
                                py: 1.5,
                            }}
                        >
                            ➕ Cadastrar Medicamento
                        </Button>

                        <Button
                            component={Link}
                            to="/medicamentos/lista"
                            variant="outlined"
                            color="primary"
                            size="large"
                            startIcon={<ListAltIcon />}
                            sx={{
                                fontWeight: 'bold',
                                borderRadius: 2,
                                py: 1.5,
                                borderWidth: 2,
                            }}
                        >
                            📋 Ver Lista de Medicamentos
                        </Button>

                        <Button
                            component={Link}
                            to="/medicamentos/historico"
                            variant="outlined"
                            color="primary"
                            size="large"
                            startIcon={<HistoryIcon />}
                            sx={{
                                fontWeight: 'bold',
                                borderRadius: 2,
                                py: 1.5,
                                borderWidth: 2,
                            }}
                        >
                            🕒 Histórico de Medicamentos
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Home;
