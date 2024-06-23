import { axiosInstance } from "../../api/axios";

async function add(formData) {
    try {

        const response = await axiosInstance.post("critica", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}


async function update(formData) {
    try {
        const response = await axiosInstance.put("critica", formData);

        return response;
    } catch (error) {
        return error?.response;
    }
}

async function excluir(codCritica) {
    try {
        const response = await axiosInstance.delete(`critica/${Number(codCritica)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function pesquisaporid(codCritica) {
    try {
        const response = await axiosInstance.get(`critica/${Number(codCritica)}`);
        return response;
    } catch (error) {
        return error?.response;
    }
}

async function listar() {
    try {
        const response = await axiosInstance.post("critica/listarCriticas");
        return response;
    } catch (error) {
        return error?.response;
    }
}


export const criticas = { add, update, excluir, listar, pesquisaporid, };