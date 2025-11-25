import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { exercicioRecomendadoApi } from "../api/exercicioRecomendadoApi";

type Paciente = {
    id_usuario: number;
    nome: string;
    idade: number;
    peso: number;
    altura: number;
};

export default function RecomendacaoExerciciosPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const paciente = location.state?.paciente as Paciente;
    const prescricaoExistente = location.state?.prescricao;

    const queryClient = useQueryClient();

    const [recomendacoes, setRecomendacoes] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [textoRecomendacao, setTextoRecomendacao] = useState("");

    useEffect(() => {
        if (!paciente) navigate("/medico");
    }, [paciente, navigate]);

    // Mutação: enviar recomendação ao backend
    const addExercicioMutation = useMutation({
        // CORREÇÃO: Passando a 'descricao' (string) diretamente como segundo argumento
        mutationFn: (descricao: string) => 
            exercicioRecomendadoApi.adicionar(prescricaoExistente.id_prescricao, descricao),
        onSuccess: () =>
            queryClient.invalidateQueries([
                "prescricao",
                prescricaoExistente.id_prescricao,
            ]),
    });

    const handleAddRecomendacao = () => {
        if (!textoRecomendacao.trim()) {
            return alert("A recomendação não pode estar vazia!");
        }

        setRecomendacoes((prev) => [...prev, textoRecomendacao.trim()]);
        setTextoRecomendacao("");
        setDialogOpen(false);
    };

    const handleRemoveRecomendacao = (index: number) => {
        setRecomendacoes(recomendacoes.filter((_, i) => i !== index));
    };

    const handleSalvar = async () => {
        if (!prescricaoExistente?.id_prescricao)
            return alert("Nenhuma prescrição encontrada!");

        try {
            for (const rec of recomendacoes) {
                // A 'rec' (string) é o argumento da mutação
                await addExercicioMutation.mutateAsync(rec); 
            }

            alert("Recomendações salvas com sucesso!");
            navigate(-1);
        } catch (e) {
            console.error(e);
            alert("Erro ao salvar as recomendações.");
        }
    };

    const dataHoje = new Date().toLocaleDateString("pt-BR");

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9fafc" }}>
                {/* VOLTAR */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: "none", mb: 2 }}
                >
                    Voltar
                </Button>

                {/* TÍTULO */}
                <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
                    RECOMENDAÇÃO DE EXERCÍCIOS
                </Typography>

                {/* PACIENTE */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Paciente: <strong>{paciente?.nome}</strong>
                </Typography>

                {/* LISTA DE RECOMENDAÇÕES */}
                <Typography variant="h6" mb={1}>
                    Recomendações:
                </Typography>

                <List dense>
                    {recomendacoes.map((rec, i) => (
                        <ListItem
                            key={i}
                            disableGutters
                            secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveRecomendacao(i)}>
                                    <AddIcon sx={{ transform: "rotate(45deg)" }} />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={rec} />
                        </ListItem>
                    ))}
                </List>

                <Button startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} sx={{ mt: 2 }}>
                    Adicionar Recomendação
                </Button>

                {/* ASSINATURA */}
                <Box textAlign="center" mt={6}>
                    <Typography variant="h6">Dr. Lucas Gabriel</Typography>
                    <Typography variant="body2">{dataHoje}</Typography>
                </Box>

                {/* SALVAR */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 4 }}
                    onClick={handleSalvar}
                >
                    Salvar Recomendações
                </Button>
            </Paper>

            {/* DIALOG */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
                <DialogTitle>Adicionar Recomendação</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Escreva a recomendação"
                            fullWidth
                            multiline
                            minRows={2}
                            value={textoRecomendacao}
                            onChange={(e) => setTextoRecomendacao(e.target.value)}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleAddRecomendacao}>
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}