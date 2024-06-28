import { axiosInstance } from "../../api/axios";


async function add(formData) {
    try {
        const response = await axiosInstance.post("membros-da-lista-de-partilhas", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function update(formData) {
    try {
        const response = await axiosInstance.put("membros-da-lista-de-partilhas", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codMembro) {
    try {
        const response = await axiosInstance.delete("membros-da-lista-de-partilhas/" + codMembro);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codMembro) {
    try {
        const response = await axiosInstance.get("membros-da-lista-de-partilhas/" + codMembro);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function listar() {
    try {
        const response = await axiosInstance.post("membros-da-lista-de-partilhas/listarMembrosDaListaDePartilhas");

        return response;
    } catch (error) {
        return error?.response;
    }
}


export const membrosDasListas = { add, update, excluir, listar, pesquisaporid };
