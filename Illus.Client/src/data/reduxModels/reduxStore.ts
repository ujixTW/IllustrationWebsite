import { configureStore } from "@reduxjs/toolkit";
import loginRedux from "./loginRedux";
import userDataRedux from "./userDataRedux";

export const store = configureStore({
  reducer: {
    login: loginRedux,
    userData: userDataRedux,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
