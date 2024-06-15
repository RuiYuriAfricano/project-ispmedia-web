import { axiosInstance } from "../../api/axios";

async function login({ username, senha }) {
  try {
    const response = await axiosInstance.post("utilizador/login", {
      username,
      senha,
    });

    return response;
  } catch (error) {
    return error?.response;
  }
}

async function register(formData) {
  try {
    const response = await axiosInstance.post("utilizador", formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
}

async function listar() {
  try {
    const response = await axiosInstance.post("utilizador/listar");

    return response;
  } catch (error) {
    return error?.response;
  }
}





export const auth = { login, register, listar };
