import { configureStore } from "@reduxjs/toolkit";
import loginRedux from "./loginRedux";

export const store = configureStore({
  reducer: {
    login: loginRedux,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
