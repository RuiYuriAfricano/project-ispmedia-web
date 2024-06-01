import { isNullOrUndef } from "chart.js/helpers";
import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("album", formData, {
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
        const response = await axiosInstance.put("album", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codAlbum) {
    try {
        const response = await axiosInstance.delete(`album/${Number(codAlbum)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codAlbum) {
    try {
        const response = await axiosInstance.get(`album/${Number(codAlbum)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaportitulo(tituloAlbum) {
    try {
        const response = await axiosInstance.post("album/pesquisaportitulo", {
            tituloAlbum,
        });
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("album/listarAlbuns");
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const album = { add, update, excluir, pesquisaportitulo, listar, pesquisaporid };