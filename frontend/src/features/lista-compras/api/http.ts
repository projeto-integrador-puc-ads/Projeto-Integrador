import axios from 'axios';

export const listaComprasApi = axios.create({
    baseURL: 'http://localhost:8080/api/lista-compras', // URL real do backend
    timeout: 10000,
});

listaComprasApi.interceptors.response.use(
    response => response,
    error => {
        console.error('[ListaCompras API] erro na chamada:', error);
        return Promise.reject(error);
    }
);
