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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import BackButton from "../components/BackButton";

import { prescricaoApi } from "../api/prescricaoApi";
import type { Prescricao, PrescricaoMedicamento, PrescricaoExame } from "../api/types";
import { type ExercicioRecomendado, exercicioRecomendadoApi } from "../api/exercicioRecomendadoApi"; 

// Função para formatar a frequência em horas
function formatFrequencia(f: string | number | undefined) {
    if (!f) return "-";
    const num = typeof f === "string" ? parseInt(f) : f;
    return isNaN(num) ? f : `${num}h`;
}

// COMPONENTE DE DETALHES DE EXERCÍCIOS
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
                    exercicios.map((e, index) => (
                        <ListItemText 
                            key={index}
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
// FIM: COMPONENTE DE DETALHES DE EXERCÍCIOS


export default function HistoricoConsultasPacientePage() {
    const navigate = useNavigate();
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");

    useEffect(() => {
        if (!usuarioLogado) navigate("/login");
    }, [usuarioLogado, navigate]);

    const pacienteNome = usuarioLogado?.nome || "Paciente";
    const pacienteId = usuarioLogado?.id_usuario;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [consultaSelecionada, setConsultaSelecionada] = useState<Prescricao | null>(null);

    const { data: consultas = [], isLoading } = useQuery({
        queryKey: ["prescricao", pacienteId],
        queryFn: () => prescricaoApi.porUsuario(pacienteId),
        enabled: !!pacienteId,
        select: (lista) =>
            lista
                .filter(
                    (c) =>
                        (c.medicamentos?.length ?? 0) > 0 || 
                        (c.exames?.length ?? 0) > 0 ||
                        (c.exerciciosRecomendados?.length ?? 0) > 0 
                )
                .sort(
                    (a, b) =>
                        new Date(b.data_prescricao).getTime() -
                        new Date(a.data_prescricao).getTime()
                ),
    });

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
            <BackButton to="/saude" />
            <PageTitle>Histórico de Consultas</PageTitle>
            <SectionTitle>
                Paciente: <b>{pacienteNome}</b>
            </SectionTitle>

            {isLoading ? (
                <Typography color="text.secondary" align="center" mt={2}>
                    Carregando…
                </Typography>
            ) : consultas.length === 0 ? (
                <Typography color="text.secondary" align="center" mt={2}>
                    Nenhuma consulta encontrada.
                </Typography>
            ) : (
                <List>
                    {consultas.map((c) => (
                        <ListItemButton
                            key={c.id_prescricao}
                            onClick={() => handleClickConsulta(c)}
                            sx={{
                                mb: 1,
                                borderRadius: 2,
                                bgcolor: "#f5f5f5",
                                "&:hover": { bgcolor: "#e0e0e0" },
                                py: 2,
                                px: 2,
                            }}
                        >
                            <ListItemText
                                primary={c.nomeMedico}
                                secondary={`Data: ${c.data_prescricao}`}
                            />
                        </ListItemButton>
                    ))}
                </List>
            )}

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
                            <Paper key={i} sx={{ p: 2, mb: 1 }}>
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

                    <Divider sx={{ my: 2 }} />

                    {/* Exames */}
                    <Typography variant="subtitle1" fontWeight="bold">
                        Exames:
                    </Typography>
                    <List dense>
                        {consultaSelecionada?.exames?.map((e: PrescricaoExame, i) => (
                            <ListItemText
                                key={i}
                                // 🟢 CORREÇÃO: Acessa 'nome_exame' diretamente do objeto 'e'
                                primary={e.nome_exame || "Exame desconhecido"}
                                secondary={e.observacao || ""}
                            />
                        )) ?? <Typography>-</Typography>}
                    </List>
                    
                    {/* EXERCÍCIOS RECOMENDADOS */}
                    {consultaSelecionada?.id_prescricao && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <ExercicioRecomendadoDetalhes prescricaoId={consultaSelecionada.id_prescricao} />
                        </>
                    )}

                    {/* Observações */}
                    {consultaSelecionada?.observacoes && (
                        <>
                            <Divider sx={{ my: 2 }} />
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