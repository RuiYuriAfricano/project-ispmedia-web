import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("conteudo-dos-grupos", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("conteudo-dos-grupos", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function updateFk(formData) {
    try {
        const response = await axiosInstance.put("atualizar-conteudo-do-grupo", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codConteudo) {
    try {
        const response = await axiosInstance.delete(`conteudo-dos-grupos/${Number(codConteudo)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codConteudo) {
    try {
        const response = await axiosInstance.get(`conteudo-dos-grupos/${Number(codConteudo)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("conteudo-dos-grupos/listarConteudoDosGrupos");
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const conteudoDosGrupos = { add, update, excluir, listar, pesquisaporid, updateFk };