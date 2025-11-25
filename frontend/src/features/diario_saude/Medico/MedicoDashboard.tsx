import { useState, useEffect } from "react";
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

import { usuarioDoencaApi } from "../api/usuarioDoencaApi";
import { usuarioAlergiaApi } from "../api/usuarioAlergiaApi";
import { questionarioApi } from "../api/questionarioApi";
import { usuarioApi } from "../api/usuarioApi";

import type { Doenca, Alergia } from "../api/types";

export default function DashboardMedico() {
    const location = useLocation();
    const navigate = useNavigate();

    const paciente = location.state?.paciente;
    const prescricao = location.state?.prescricao;

    useEffect(() => {
        if (!paciente || !prescricao) {
            // O redirecionamento só é executado após a montagem/renderização
            navigate("/medico");
        }
    }, [paciente, prescricao, navigate]); // Adicionado `Maps` nas dependências

    // -----------------------------
    // Restante do estado e lógica
    // -----------------------------
    const [editData, setEditData] = useState({
        nome: paciente?.nome ?? "", // Usa optional chaining (?) para evitar erro se paciente for nulo
        idade: String(paciente?.idade ?? ""),
        peso: String(paciente?.peso ?? ""),
        altura: String(paciente?.altura ?? ""),
        alergias: paciente?.alergias ?? "",
    });

    const [doencas, setDoencas] = useState<Doenca[]>([]);
    const [alergias, setAlergias] = useState<Alergia[]>([]);
    const [pontuacao, setPontuacao] = useState<number | null>(null);
    const [interpretacao, setInterpretacao] = useState<string>("");

    // Se o paciente ou a prescrição ainda não foram carregados (e o useEffect de cima
    // ainda não executou a navegação), retorne null temporariamente para evitar erros
    // de acesso a propriedades (como paciente.id_usuario) no restante do componente.
    if (!paciente || !prescricao) {
        return null; 
    }

    // -----------------------------
    // CARREGAR DADOS DO PACIENTE
    // -----------------------------
    useEffect(() => {
        usuarioDoencaApi.listar(paciente.id_usuario).then(setDoencas);
        usuarioAlergiaApi.listar(paciente.id_usuario).then(setAlergias);

        questionarioApi.obterRespostas(paciente.id_usuario).then((respostas) => {
            const total = respostas.reduce((acc, r) => acc + r.peso, 0);
            setPontuacao(total);

            if (total <= 6) setInterpretacao("baixa vulnerabilidade clínico funcional");
            else if (total <= 10) setInterpretacao("moderada vulnerabilidade clínico funcional");
            else setInterpretacao("alta vulnerabilidade clínico funcional");
        });
    }, [paciente.id_usuario]);

    // -----------------------------
    // SALVAR ALTERAÇÕES (mantido)
    // -----------------------------
    const handleSalvar = async () => {
        try {
            const payload = {
                id_usuario: paciente.id_usuario,
                ...editData,
            };

            await usuarioApi.atualizar(payload);

            alert("Informações do paciente atualizadas!");
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar informações.");
        }
    };

    const handleChange = (e: any) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    // -----------------------------
    // RENDER (mantido)
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

                            <Button variant="contained" onClick={handleSalvar}>
                                Salvar Alterações
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