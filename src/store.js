import { legacy_createStore as createStore } from 'redux'
import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./redux/app/slice";

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

let store = createStore(changeState)
store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});
export default store
