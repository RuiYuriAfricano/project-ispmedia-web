import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("playlist", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("playlist", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codPlaylist) {
    try {
        const response = await axiosInstance.delete(`playlist/${Number(codPlaylist)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codPlaylist) {
    try {
        const response = await axiosInstance.get(`playlist/${Number(codPlaylist)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("playlist/listarPlaylists");
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const playlist = { add, update, excluir, listar, pesquisaporid };