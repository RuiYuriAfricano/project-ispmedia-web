import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("videos-da-playlist", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("videos-da-playlist", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codVideoPlaylist) {
    try {
        const response = await axiosInstance.delete(`videos-da-playlist/${Number(codVideoPlaylist)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codVideoPlaylist) {
    try {
        const response = await axiosInstance.get(`videos-da-playlist/${Number(codVideoPlaylist)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("videos-da-playlist/listarVideosDaPlaylist");
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const videosDaPlaylist = { add, update, excluir, listar, pesquisaporid };