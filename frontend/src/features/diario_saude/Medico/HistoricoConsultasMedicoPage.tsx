import { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    List,
    ListItemText,
    ListItemButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import type { Prescricao, PrescricaoMedicamento, PrescricaoExame } from "../api/types";
import { prescricaoApi } from "../api/prescricaoApi";
import { type ExercicioRecomendado, exercicioRecomendadoApi } from "../api/exercicioRecomendadoApi"; 


// Componentes de Layout
function PageContainer({ children }: { children: React.ReactNode }) {
    return <Container maxWidth="xl" sx={{ py: 5 }}>{children}</Container>;
}

function PageTitle({ children }: { children: React.ReactNode }) {
    return (
        <Typography variant="h4" fontWeight="bold" mb={4} align="center">
            {children}
        </Typography>
    );
}

// Função para formatar a frequência em horas
function formatFrequencia(f: string | number | undefined) {
    if (!f) return "-";
    const num = typeof f === "string" ? parseInt(f) : f;
    return isNaN(num) ? f : `${num}h`;
}

function ExercicioRecomendadoDetalhes({ prescricaoId }: { prescricaoId: number }) {
    const [exercicios, setExercicios] = useState<ExercicioRecomendado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!prescricaoId) return;

        setLoading(true);
        setError(false);

        exercicioRecomendadoApi.listar(prescricaoId)
            .then((res) => {
                setExercicios(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar exercícios:", err);
                setError(true);
                setLoading(false);
            });
    }, [prescricaoId]);

    if (loading) {
        return <Typography>Carregando exercícios...</Typography>;
    }
    if (error) {
        return <Typography color="error">Erro ao carregar exercícios.</Typography>;
    }

    return (
        <>
            <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
                Exercícios Recomendados:
            </Typography>
            <List dense>
                {exercicios.length > 0 ? (
                    exercicios.map((e) => (
                        <ListItemText 
                            key={e.id}
                            primary={e.descricao} 
                        />
                    ))
                ) : (
                    <Typography color="text.secondary">- Nenhuma recomendação de exercício.</Typography>
                )}
            </List>
        </>
    );
}


export default function HistoricoConsultasMedicoPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const paciente = location.state?.paciente;
    if (!paciente) {
        navigate("/atendimento/dashboard");
        return null;
    }

    const [consultas, setConsultas] = useState<Prescricao[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [consultaSelecionada, setConsultaSelecionada] = useState<Prescricao | null>(null);

    useEffect(() => {
        if (!paciente?.id_usuario) return;

        prescricaoApi.porUsuario(paciente.id_usuario)
            .then((res) => {
                const filtradas = res
                    .filter(c => 
                        ((c.medicamentos ?? []).length > 0) || 
                        ((c.exames ?? []).length > 0) ||
                        // Garantindo que a filtragem por exerciciosRecomendados continua funcionando
                        ((c.exerciciosRecomendados ?? []).length > 0) 
                    )
                    .sort((a, b) => new Date(b.data_prescricao).getTime() - new Date(a.data_prescricao).getTime());

                setConsultas(filtradas);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [paciente?.id_usuario]);

    const handleClickConsulta = (consulta: Prescricao) => {
        setConsultaSelecionada(consulta);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
        setConsultaSelecionada(null);
    };

    return (
        <PageContainer>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ textTransform: "none", mb: 2 }}
            >
                Voltar
            </Button>
            
            <PageTitle>Histórico de Consultas — {paciente.nome}</PageTitle>

            {loading ? (
                <Typography color="text.secondary" align="center" mt={2}>
                    Carregando…
                </Typography>
            ) : consultas.length === 0 ? (
                <Typography color="text.secondary" align="center" mt={2}>
                    Nenhuma consulta encontrada.
                </Typography>
            ) : (
                <List>
                    {consultas.map(c => (
                        <ListItemButton
                            key={c.id_prescricao}
                            onClick={() => handleClickConsulta(c)}
                            sx={{ mb:1, borderRadius:2, bgcolor:"#f5f5f5", "&:hover":{bgcolor:"#e0e0e0"}, py:2, px:2 }}
                        >
                            <ListItemText
                                primary={c.nomeMedico}
                                secondary={`Data: ${c.data_prescricao}`}
                            />
                        </ListItemButton>
                    ))}
                </List>
            )}

            {/* Dialog detalhado */}
            <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {consultaSelecionada?.nomeMedico} — {consultaSelecionada?.data_prescricao}
                </DialogTitle>
                <DialogContent dividers>
                    {/* Medicamentos */}
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Medicamentos:
                    </Typography>
                    <List dense>
                        {consultaSelecionada?.medicamentos?.map((m: PrescricaoMedicamento, i) => (
                            <Paper key={i} sx={{ p:2, mb:1 }}>
                                <Box display="flex" flexDirection="column" gap={0.5}>
                                    <Typography fontWeight="bold">{m.nome_medicamento || "-"}</Typography>
                                    <Box display="flex" gap={2} flexWrap="wrap">
                                        <Typography>Princípio ativo: {m.principio_ativo || "-"}</Typography>
                                        <Typography>Concentração: {m.concentracao || "-"}</Typography>
                                        <Typography>Via: {m.via || "-"}</Typography>
                                    </Box>
                                    <Box display="flex" gap={2} flexWrap="wrap">
                                        <Typography>Dosagem: {m.dosagem || "-"}</Typography>
                                        <Typography>Frequência: {formatFrequencia(m.frequencia)}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        )) ?? <Typography>-</Typography>}
                    </List>

                    <Divider sx={{ my:2 }}/>

                    {/* Exames */}
                    <Typography variant="subtitle1" fontWeight="bold">
                        Exames:
                    </Typography>
                    <List dense>
                        {consultaSelecionada?.exames?.map((e: PrescricaoExame, i) => (
                            <ListItemText
                                key={i}
                                primary={e.nome_exame || "Exame desconhecido"}
                                secondary={e.observacao || ""}
                            />
                        )) ?? <Typography>-</Typography>}
                    </List>
                    
                    {consultaSelecionada?.id_prescricao && (
                        <>
                            <Divider sx={{ my:2 }}/>
                            <ExercicioRecomendadoDetalhes prescricaoId={consultaSelecionada.id_prescricao} />
                        </>
                    )}

                    {/* Observações */}
                    {consultaSelecionada?.observacoes && (
                        <>
                            <Divider sx={{ my:2 }}/>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Observações:
                            </Typography>
                            <Typography>{consultaSelecionada.observacoes}</Typography>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
}