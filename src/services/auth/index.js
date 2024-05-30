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

async function download(username) {
  try {
    const destination = "C:/ISPMediaUserPhoto";
    const response = await axiosInstance.get(`http://localhost:3333/utilizador/download/${username}?destination=${destination}`, {
      responseType: 'blob' // Set the response type to blob
    });

    if (response.status !== 200) {
      throw new Error('Failed to download image');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = () => {
        const imageSrc = reader.result;
        resolve(imageSrc);
      };
      reader.onerror = error => {
        reject(error);
      };
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
}





export const auth = { login, register, download };
