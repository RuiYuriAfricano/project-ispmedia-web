import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";
import { initLoginAsyncFunctions } from "./extra-reducers/auth";

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    saveLoginData: (state, action) => {
      state.login.senha = action.payload.senha;
      state.login.username = action.payload.username;
    },
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    setLoggedUser: (state, action) => {
      state.user = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    initLoginAsyncFunctions(builder);
  },
});

export const { setSidebarShow, saveLoginData, setIsLogged, setLoggedUser, setTheme } = appSlice.actions;
export default appSlice.reducer;
