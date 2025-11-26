// Arquivo: src/features/remember/components/UsuarioConquistas.tsx

import React, { useEffect, useState } from 'react';
import { getConquistas } from '../api/remember';
import type { ConquistaDTO } from '../types/remember';

interface ConquistaUsuarioUI extends ConquistaDTO {
    obtida: boolean;
    progressoAtual: number;
}


const IMAGE_BASE_URL = "http://localhost:8080/api/public/sistema/icones/";

const ConquistasUsuario: React.FC = () => {
    const [userConquistas, setUserConquistas] = useState<ConquistaUsuarioUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. BUSCA REAL: Pega as definições do servidor
            const response = await getConquistas();
            const dadosReaisDoBackend: ConquistaDTO[] = response.data;

            // 2. SIMULAÇÃO DE STATUS (Temporário):
            // Como o backend ainda não informa o progresso do usuário,
            // vamos gerar um status aleatório para cada conquista real
            // para que a interface possa ser visualizada.
            const dadosComStatusSimulado: ConquistaUsuarioUI[] = dadosReaisDoBackend.map(conquista => {
                // Simula que 40% das conquistas foram obtidas
                const isObtida = Math.random() > 0.6;
                // Simula um progresso aleatório até a meta
                const progressoSimulado = isObtida ? conquista.meta : Math.floor(Math.random() * conquista.meta);

                return {
                    ...conquista, // Copia todos os dados reais (id, nome, pontos, iconeUrl...)
                    obtida: isObtida,
                    progressoAtual: progressoSimulado
                };
            });

            setUserConquistas(dadosComStatusSimulado);

        } catch (err) {
            console.error("Erro ao carregar conquistas do usuário:", err);
            setError('Não foi possível carregar suas conquistas no momento.');
        } finally {
            setLoading(false);
        }
    };

    // Separa a lista baseada no estado atual
    const obtidas = userConquistas.filter(c => c.obtida);
    const aConquistar = userConquistas.filter(c => !c.obtida);

    const renderCard = (conquista: ConquistaUsuarioUI) => {
        const estiloCard: React.CSSProperties = {
            display: 'flex', alignItems: 'center', padding: '16px', marginBottom: '12px', borderRadius: '12px',
            background: conquista.obtida ? '#e8f5e9' : '#f5f5f5',
            border: conquista.obtida ? '2px solid #4caf50' : '2px solid #e0e0e0',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)', opacity: conquista.obtida ? 1 : 0.9
        };

        const estiloImagem: React.CSSProperties = {
            width: '60px', height: '60px', objectFit: 'contain', marginRight: '16px',
            // Aplica filtro se não obtida
            filter: conquista.obtida ? 'none' : 'grayscale(100%) opacity(0.6)',
            transition: 'all 0.3s'
        };

        // Cálculo da porcentagem para a barra de progresso
        const porcentagemProgresso = Math.min(100, (conquista.progressoAtual / conquista.meta) * 100);

        return (
            <div style={estiloCard}>
                <img
                    // Usa a URL real do backend
                    src={`${IMAGE_BASE_URL}${conquista.iconeUrl}`}
                    alt={conquista.nome}
                    style={estiloImagem}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60?text=?'; }}
                />
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: conquista.obtida ? '#2e7d32' : '#424242' }}>
                            {conquista.nome}
                        </h3>
                        <span style={{ background: conquista.obtida ? '#4caf50' : '#bdbdbd', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            +{conquista.pontos} pts
                        </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#616161', lineHeight: 1.4 }}>{conquista.descricao}</p>

                    {/* Área de Progresso (sempre visível agora, mas muda o estilo se completo) */}
                    <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#757575', marginBottom: '4px' }}>
                            <span>Progresso: {conquista.progressoAtual} / {conquista.meta}</span>
                            <span>{porcentagemProgresso.toFixed(0)}%</span>
                        </div>
                        <div style={{ height: '8px', width: '100%', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${porcentagemProgresso}%`,
                                background: conquista.obtida ? '#4caf50' : '#1976d2', // Verde se completou, Azul se em andamento
                                borderRadius: '4px',
                                transition: 'width 0.5s ease-in-out'
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Carregando suas conquistas...</div>;
    }

    if (error) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#d32f2f' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '24px', background: '#fff', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ color: '#1976d2', margin: '0 0 8px 0' }}>Minhas Conquistas</h1>
                <p style={{ color: '#666', margin: 0 }}>Acompanhe seu progresso e celebre suas vitórias!</p>
            </div>

            {obtidas.length > 0 && (
                <section style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #4caf50', paddingBottom: '8px' }}>
                        <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🏆</span>
                        <h2 style={{ fontSize: '1.3rem', color: '#2e7d32', margin: 0 }}>
                            Conquistadas ({obtidas.length})
                        </h2>
                    </div>
                    {obtidas.map(renderCard)}
                </section>
            )}

            {aConquistar.length > 0 && (
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #1976d2', paddingBottom: '8px' }}>
                        <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🚀</span>
                        <h2 style={{ fontSize: '1.3rem', color: '#1565c0', margin: 0 }}>
                            Em Andamento ({aConquistar.length})
                        </h2>
                    </div>
                    {aConquistar.map(renderCard)}
                </section>
            )}

            {userConquistas.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    Nenhuma conquista disponível no sistema ainda.
                </div>
            )}
        </div>
    );
};

export default ConquistasUsuario;