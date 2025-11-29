import { List, ListItemText, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { type ExercicioRecomendado, exercicioRecomendadoApi } from "../api/exercicioRecomendadoApi";

function ExercicioRecomendadoDetalhes({ prescricaoId }: { prescricaoId: number }) {

    // 1. Usar useQuery para buscar os dados
    const { 
        data: exercicios = [], // Renomear 'data' para 'exercicios' e definir um array vazio como padrão
        isLoading,
        isError,
    } = useQuery<ExercicioRecomendado[]>({
        // 2. Definir uma chave de query única e estável que inclui o ID
        queryKey: ["prescricao", prescricaoId, "exercicios"],

        // 3. Definir a função que faz a chamada da API
        queryFn: () => exercicioRecomendadoApi.listar(prescricaoId),

        // 4. Habilitar a query apenas se o ID da prescrição existir
        enabled: !!prescricaoId,
    });

    // 5. Renderização condicional gerenciada pelo useQuery
    if (isLoading) {
        return <Typography>Carregando exercícios...</Typography>;
    }

    if (isError) {
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