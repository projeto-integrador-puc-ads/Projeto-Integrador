// Arquivo: src/features/remember/pages/ConquistasPage.tsx

import React, { useEffect, useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import { getConquistas } from '../api/remember';
import type {ConquistaDTO} from '../types/remember';
import '../styles/ConquistasPage.css';

const IMAGE_BASE_URL = "http://localhost:8080/api/public/sistema/icones/";

const ConquistasPage: React.FC = () => {
    const [allConquistas, setAllConquistas] = useState<ConquistaDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Chama a API centralizada da feature
            const response = await getConquistas();

            // Assumindo que seu cliente HTTP (ex: axios) retorna os dados dentro de .data
            // Se retornar a lista direto, use: setAllConquistas(response);
            setAllConquistas(response.data);

        } catch (err) {
            console.error("Erro ao carregar conquistas:", err);
            setError('Falha ao carregar a lista de conquistas. Verifique a conexão com o backend.');
        } finally {
            setLoading(false);
        }
    };

    // Lógica de filtragem
    const filteredConquistas = allConquistas.filter(conquista => {
        const term = searchTerm.toLowerCase();
        return (
            conquista.nome.toLowerCase().includes(term) ||
            conquista.descricao.toLowerCase().includes(term)
        );
    });

    return (
        // Nota: mantive a classe 'admin-container' no CSS para não quebrar estilos existentes.
        // Você pode renomeá-la no CSS se quiser algo mais genérico como 'conquistas-page-container'.
        <div className="admin-container">
            <div className="admin-header">
                <h1>Gerenciar Conquistas</h1>
                <button className="btn-new">+ Nova Conquista</button>
            </div>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Pesquisar por nome ou descrição..."
            />

            {loading && <p>Carregando dados...</p>}
            {error && <p className="error-msg">{error}</p>}

            {!loading && !error && (
                <>
                    <p className="filter-info">Mostrando {filteredConquistas.length} de {allConquistas.length} registros.</p>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ícone</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Pontos</th>
                                <th>Meta/Tipo</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredConquistas.length === 0 ? (
                                <tr><td colSpan={7} style={{textAlign: 'center'}}>Nenhuma conquista encontrada.</td></tr>
                            ) : (
                                filteredConquistas.map((conquista) => (
                                    <tr>
                                        <td></td>
                                        <td>
                                            <img
                                                src={`${IMAGE_BASE_URL}${conquista.iconeUrl}`}
                                                alt={conquista.nome}
                                                className="admin-list-icon"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=X';
                                                }}
                                            />
                                            <br/>
                                            <small style={{fontSize: '0.7em', color: '#666'}}>{conquista.iconeUrl}</small>
                                        </td>
                                        <td style={{fontWeight: 'bold'}}>{conquista.nome}</td>
                                        <td style={{maxWidth: '300px'}}>{conquista.descricao}</td>
                                        <td>
                        <span style={{fontWeight: 'bold', color: '#28a745'}}>
                            {conquista.pontos} pts
                        </span>
                                        </td>
                                        <td>
                                            <div style={{fontSize: '0.9em'}}> Meta: <strong>{conquista.meta}</strong></div>
                                            <div style={{fontSize: '0.9em'}}> Tipo: <strong>{conquista.tipo}</strong></div>
                                        </td>
                                        <td>
                                            <button className="btn-action btn-edit">Editar</button>
                                            <button className="btn-action btn-delete">Excluir</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConquistasPage;