import { axiosInstance } from "../../api/axios";


async function add(formData) {
    try {
        const response = await axiosInstance.post("membros-dos-grupos", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function update(formData) {
    try {
        const response = await axiosInstance.put("membros-dos-grupos", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codMembro) {
    try {
        const response = await axiosInstance.delete("membros-dos-grupos/" + codMembro);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codMembro) {
    try {
        const response = await axiosInstance.get("membros-dos-grupos/" + codMembro);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function listar() {
    try {
        const response = await axiosInstance.post("membros-dos-grupos/listarMembrosDosGrupos");

        return response;
    } catch (error) {
        return error?.response;
    }
}


export const membrosDosGrupos = { add, update, excluir, listar, pesquisaporid };
