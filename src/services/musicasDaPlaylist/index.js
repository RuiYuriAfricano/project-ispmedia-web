import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("musicas-da-playlist", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("musicas-da-playlist", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codMusicaPlaylist) {
    try {
        const response = await axiosInstance.delete(`musicas-da-playlist/${Number(codMusicaPlaylist)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codMusicaPlaylist) {
    try {
        const response = await axiosInstance.get(`musicas-da-playlist/${Number(codMusicaPlaylist)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("musicas-da-playlist/listarMusicasDaPlaylist");
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const musicasDaPlaylist = { add, update, excluir, listar, pesquisaporid };