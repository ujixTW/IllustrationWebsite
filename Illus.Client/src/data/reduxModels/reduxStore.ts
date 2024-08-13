import { configureStore } from "@reduxjs/toolkit";
import loginRedux from "./loginRedux";
import artworkCateRedux from "./artworkCateRedux";

export const store = configureStore({
  reducer: {
    login: loginRedux,
    artworkCate: artworkCateRedux,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
