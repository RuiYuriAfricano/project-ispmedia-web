import { axiosInstance } from "../../api/axios";


async function add(formData) {
    try {
        const response = await axiosInstance.post("grupoMusical", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function update(formData) {
    try {
        const response = await axiosInstance.put("grupoMusical", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codGrupoMusical) {
    try {
        const response = await axiosInstance.delete("grupoMusical/" + codGrupoMusical);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codGrupoMusical) {
    try {
        const response = await axiosInstance.get("grupoMusical/" + codGrupoMusical);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisapornome(nomeGrupoMusical) {
    try {
        const response = await axiosInstance.post("grupoMusical/pesquisapornome", {
            "nomeGrupoMusical": nomeGrupoMusical,
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("grupoMusical/listarGruposMusicais");

        return response;
    } catch (error) {
        return error?.response;
    }
}


export const grupoMusical = { add, update, excluir, pesquisapornome, listar, pesquisaporid };
