import { axiosInstance } from "../../api/axios";


async function add(formData) {
    try {
        const response = await axiosInstance.post("grupo-de-amigos", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function update(formData) {
    try {
        const response = await axiosInstance.put("grupo-de-amigos", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codGrupoDeAmigos) {
    try {
        const response = await axiosInstance.delete("grupo-de-amigos/" + codGrupoDeAmigos);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codGrupoDeAmigos) {
    try {
        const response = await axiosInstance.get("grupo-de-amigos/" + codGrupoDeAmigos);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function listar() {
    try {
        const response = await axiosInstance.post("grupo-de-amigos/listarGruposDeAmigos");

        return response;
    } catch (error) {
        return error?.response;
    }
}


export const grupoDeAmigos = { add, update, excluir, listar, pesquisaporid };
