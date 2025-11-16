import axios from 'axios';

export const listaComprasApi = axios.create({
    baseURL: '/api/lista-compras', // quando tiver back real, ajusta aqui
    timeout: 10000,
});

listaComprasApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[ListaCompras API] erro na chamada:', error);
        return Promise.reject(error);
    }
);
