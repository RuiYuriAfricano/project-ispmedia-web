import { axiosInstance } from "../../api/axios";


async function add(formData) {
    try {
        const response = await axiosInstance.post("lista-de-partilha", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function update(formData) {
    try {
        const response = await axiosInstance.put("lista-de-partilha", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codListaDePartilha) {
    try {
        const response = await axiosInstance.delete("lista-de-partilha/" + codListaDePartilha);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codListaDePartilha) {
    try {
        const response = await axiosInstance.get("lista-de-partilha/" + codListaDePartilha);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function listar() {
    try {
        const response = await axiosInstance.post("lista-de-partilha/listarListasDePartilha");

        return response;
    } catch (error) {
        return error?.response;
    }
}



export const listaDePartilha = { add, update, excluir, listar, pesquisaporid };
