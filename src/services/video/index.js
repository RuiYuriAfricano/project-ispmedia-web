import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("video", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("video", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codVideo) {
    try {
        const response = await axiosInstance.delete(`video/${Number(codVideo)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codVideo) {
    try {
        const response = await axiosInstance.get(`video/${Number(codVideo)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaportitulo(tituloVideo) {
    try {
        const response = await axiosInstance.post("video/pesquisaportitulo", {
            tituloVideo,
        });
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("video/listarVideos");
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const video = { add, update, excluir, pesquisaportitulo, listar, pesquisaporid };