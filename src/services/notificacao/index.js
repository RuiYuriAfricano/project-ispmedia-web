import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("notificacao", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("notificacao", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codNotificacao) {
    try {
        const response = await axiosInstance.delete(`notificacao/${Number(codNotificacao)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codCritica) {
    try {
        const response = await axiosInstance.get(`notificacao/${Number(codNotificacao)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("notificacao/listarNotificacoes");
        return response;
    } catch (error) {
        return error?.response;
    }
}


export const notificacao = { add, update, excluir, listar, pesquisaporid, };