import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("participacaoMusica", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("participacaoMusica", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codParticipacaoMusica) {
    try {
        const response = await axiosInstance.delete(`participacaoMusica/${Number(codParticipacaoMusica)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codParticipacaoMusica) {
    try {
        const response = await axiosInstance.get(`participacaoMusica/${Number(codParticipacaoMusica)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}
async function listar() {
    try {
        const response = await axiosInstance.post("participacaoMusica/listarParticipacaoMusica");
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const participacaoMusica = { add, update, excluir, listar, pesquisaporid };