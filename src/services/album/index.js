import { axiosInstance } from "../../api/axios";


async function add(formData) {
    try {
        const response = await axiosInstance.post("album", {
            ...formData,
            "fkArtista": formData.fkArtista !== null ? Number(formData.fkArtista) : null,
            "fkUtilizador": Number(formData.fkUtilizador),
            "fkGrupoMusical": formData.fkGrupoMusical !== null ? Number(formData.fkGrupoMusical) : null
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function update(formData) {
    try {
        const response = await axiosInstance.put("album", {
            ...formData,
            "codAlbum": Number(formData.codAlbum),
            "fkArtista": formData.fkArtista !== null ? Number(formData.fkArtista) : null,
            "fkUtilizador": Number(formData.fkUtilizador),
            "fkGrupoMusical": formData.fkGrupoMusical !== null ? Number(formData.fkGrupoMusical) : null
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codAlbum) {
    try {
        const response = await axiosInstance.delete("album/" + codAlbum);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codAlbum) {
    try {
        const response = await axiosInstance.get("album/" + codAlbum);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaportitulo(tituloAlbum) {
    try {
        const response = await axiosInstance.post("album/pesquisaportitulo", {
            "tituloAlbum": tituloAlbum,
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
