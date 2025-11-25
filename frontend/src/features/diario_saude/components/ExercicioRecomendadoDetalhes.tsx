import { useState, useEffect } from "react";
import { List, ListItemText, Typography } from "@mui/material";

import { type ExercicioRecomendado, exercicioRecomendadoApi } from "../api/exercicioRecomendadoApi";

// Usando o padrão useEffect/useState
function ExercicioRecomendadoDetalhes({ prescricaoId }: { prescricaoId: number }) {
    // Agora o tipo ExercicioRecomendado está definido
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

export default ExercicioRecomendadoDetalhes;