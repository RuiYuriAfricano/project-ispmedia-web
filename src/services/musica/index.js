import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("musica", formData, {
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
        const response = await axiosInstance.put("musica", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codMusica) {
    try {
        const response = await axiosInstance.delete(`musica/${Number(codMusica)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codMusica) {
    try {
        const response = await axiosInstance.get(`musica/${Number(codMusica)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaportitulo(tituloMusica) {
    try {
        const response = await axiosInstance.post("musica/pesquisaportitulo", {
            tituloMusica,
        });
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("musica/listarMusicas");
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listarPorPagina(page, pageSize) {
    try {
        const response = await axiosInstance.get(`musica/listarMusicasPorPagina/${page}/${pageSize}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}



export const musica = { add, update, excluir, pesquisaportitulo, listar, listarPorPagina, pesquisaporid };