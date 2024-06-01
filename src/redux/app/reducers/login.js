export const saveLoginData = (state, action) => {
  state.login.senha = action.payload.senha;
  state.login.username = action.payload.username;
};

export const setIsLogged = (state, action) => {
  state.isLogged = action.payload;
};

export const setLoggedUser = (state, action) => {
  state.user = action.payload;
};

export const setSidebarShow = (state, action) => {
  state.sidebarShow = action.payload;
};
export const setTheme = (state, action) => {
  state.theme = action.payload;
};