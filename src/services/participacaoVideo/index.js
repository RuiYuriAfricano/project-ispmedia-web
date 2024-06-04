import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("participacaoVideo", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("participacaoVideo", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codParticipacaoVideo) {
    try {
        const response = await axiosInstance.delete(`participacaoVideo/${Number(codParticipacaoVideo)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codParticipacaoVideo) {
    try {
        const response = await axiosInstance.get(`participacaoVideo/${Number(codParticipacaoVideo)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}
async function listar() {
    try {
        const response = await axiosInstance.post("participacaoVideo/listarParticipacaoVideo");
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const participacaoVideo = { add, update, excluir, listar, pesquisaporid };