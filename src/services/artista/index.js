import { axiosInstance } from "../../api/axios";


async function add(formData) {
    try {
        const response = await axiosInstance.post("artista", {
            "nomeArtista": formData.nomeArtista,
            "generoMusical": formData.generoMusical,
            "fkGrupoMusical": formData.fkGrupoMusical !== null ? Number(formData.fkGrupoMusical) : null,
            "fkUtilizador": Number(formData.fkUtilizador),
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function update(formData) {
    try {
        const response = await axiosInstance.put("artista", {
            "codArtista": Number(formData.codArtista),
            "nomeArtista": formData.nomeArtista,
            "generoMusical": formData.generoMusical,
            "fkGrupoMusical": formData.fkGrupoMusical !== null ? Number(formData.fkGrupoMusical) : null,
            "fkUtilizador": Number(formData.fkUtilizador),
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codArtista) {
    try {
        const response = await axiosInstance.delete("artista/" + codArtista);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codArtista) {
    try {
        const response = await axiosInstance.get("artista/" + codArtista);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisapornome(nomeArtista) {
    try {
        const response = await axiosInstance.post("artista/pesquisapornome", {
            "nomeArtista": nomeArtista,
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("artista/listarArtistas");

        return response;
    } catch (error) {
        return error?.response;
    }
}


export const artista = { add, update, excluir, pesquisapornome, listar, pesquisaporid };
