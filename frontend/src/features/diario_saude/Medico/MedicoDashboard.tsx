import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ModuleGridMedico } from "@/features/diario_saude/components/ModuleGridMedico";

import { useQuery, useMutation } from "@tanstack/react-query";

import { usuarioDoencaApi } from "../api/usuarioDoencaApi";
import { usuarioAlergiaApi } from "../api/usuarioAlergiaApi";
import { questionarioApi } from "../api/questionarioApi";
import { usuarioApi } from "../api/usuarioApi";

import type { Doenca, Alergia } from "../api/types";

export default function DashboardMedico() {
    const location = useLocation();
    const navigate = useNavigate();

    // Dados passados na navegação
    const paciente = location.state?.paciente;
    const prescricao = location.state?.prescricao;

    // Redirecionamento se faltarem dados (Lógica mantida, mas pode ser simplificada)
    if (!paciente || !prescricao) {
        // Navega se o componente for montado sem dados necessários
        navigate("/medico", { replace: true });
        return null; 
    }

    // ID do paciente é necessário para as queries
    const pacienteId = paciente.id_usuario;

    // -----------------------------
    // ESTADO LOCAL (para formulário)
    // -----------------------------
    const [editData, setEditData] = useState({
        nome: paciente.nome ?? "",
        idade: String(paciente.idade ?? ""),
        peso: String(paciente.peso ?? ""),
        altura: String(paciente.altura ?? ""),
        // Removida a alergias: paciente.alergias ?? "" pois alergias são listas
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };


    // -----------------------------
    // CARREGAR DADOS COM REACT QUERY (NOVO PADRÃO)
    // -----------------------------

    // LISTAR DOENÇAS
    const { data: doencas = [] } = useQuery<Doenca[]>({
        queryKey: ["usuario", pacienteId, "doencas"],
        queryFn: () => usuarioDoencaApi.listar(pacienteId),
    });

    // LISTAR ALERGIAS
    const { data: alergias = [] } = useQuery<Alergia[]>({
        queryKey: ["usuario", pacienteId, "alergias"],
        queryFn: () => usuarioAlergiaApi.listar(pacienteId),
    });

    // OBTER RESPOSTAS DO QUESTIONÁRIO
    const { data: questionarioRespostas = [] } = useQuery<Array<{ peso: number }>>({
        queryKey: ["usuario", pacienteId, "questionario"],
        queryFn: () => questionarioApi.obterRespostas(pacienteId),
    });


    // -----------------------------
    // LÓGICA DE PONTUAÇÃO (useMemo)
    // -----------------------------

    // Cálculo da pontuação total (só recalcula se as respostas mudarem)
    const pontuacao = useMemo(() => {
        return questionarioRespostas.reduce((acc, r) => acc + r.peso, 0);
    }, [questionarioRespostas]);

    // Interpretação da pontuação (só recalcula se a pontuação mudar)
    const interpretacao = useMemo(() => {
        if (pontuacao <= 6) return "baixa vulnerabilidade clínico funcional";
        if (pontuacao <= 10) return "moderada vulnerabilidade clínico funcional";
        return "alta vulnerabilidade clínico funcional";
    }, [pontuacao]);


    // -----------------------------
    // SALVAR ALTERAÇÕES (useMutation)
    // -----------------------------
    const updatePacienteMutation = useMutation({
        mutationFn: (payload: any) => usuarioApi.atualizar(payload),
        onSuccess: () => {
            alert("Informações do paciente atualizadas!");
            // Opcional: Invalida a query do paciente para garantir dados atualizados se for necessário
            // queryClient.invalidateQueries(["usuario", pacienteId]);
        },
        onError: (err) => {
            console.error(err);
            alert("Erro ao atualizar informações. Verifique o console.");
        }
    });


    const handleSalvar = () => {
        const payload = {
            id_usuario: paciente.id_usuario,
            // Note: Campos como idade, peso e altura devem ser convertidos para number se o backend exigir.
            nome: editData.nome,
            idade: Number(editData.idade),
            peso: Number(editData.peso),
            altura: Number(editData.altura),
        };
        updatePacienteMutation.mutate(payload);
    };


    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <Container maxWidth="xl" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" mb={4} align="center">
                    Dashboard Médico
                </Typography>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                    {/* Painel do Paciente */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            flex: "1 1 600px",
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: 3,
                            minWidth: 500,
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="h5" fontWeight="bold">
                                Informações do Paciente
                            </Typography>

                            <TextField
                                label="Nome"
                                name="nome"
                                value={editData.nome}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Idade"
                                name="idade"
                                type="number"
                                value={editData.idade}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Peso (kg)"
                                name="peso"
                                type="number"
                                value={editData.peso}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Altura (m)"
                                name="altura"
                                type="number"
                                value={editData.altura}
                                onChange={handleChange}
                                fullWidth
                            />

                            <Button 
                                variant="contained" 
                                onClick={handleSalvar}
                                disabled={updatePacienteMutation.isLoading} // Desabilita durante o carregamento
                            >
                                {updatePacienteMutation.isLoading ? "Salvando..." : "Salvar Alterações"}
                            </Button>

                            {pontuacao !== null && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 3,
                                        border: "1px solid #ccc",
                                        borderRadius: 2,
                                        bgcolor: "#f5f5f5",
                                    }}
                                >
                                    <Typography variant="h6">Pontuação do Questionário</Typography>
                                    <Typography fontWeight="bold" fontSize="1.2rem">
                                        Total: {pontuacao} pontos
                                    </Typography>
                                    <Typography>{interpretacao}</Typography>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Doenças</Typography>
                                {doencas.map((d) => (
                                    <Typography key={d.id}>• {d.nome}</Typography>
                                ))}
                            </Box>

                            <Box>
                                <Typography variant="h6" fontWeight="bold">Alergias</Typography>
                                {alergias.map((a) => (
                                    <Typography key={a.id}>• {a.nome}</Typography>
                                ))}
                            </Box>
                        </Box>
                    </Paper>

                    {/* Painel Modular */}
                    <Box sx={{ flex: "3 1 700px" }}>
                        <Typography variant="h5" fontWeight="bold" mb={2}>Funções</Typography>
                        <ModuleGridMedico paciente={paciente} prescricao={prescricao} />
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}