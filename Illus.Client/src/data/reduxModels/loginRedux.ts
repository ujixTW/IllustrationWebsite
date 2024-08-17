import { createSlice } from "@reduxjs/toolkit";

const initState = false;

const loginSlice = createSlice({
  name: "login",
  initialState: initState,
  reducers: {
    login(state) {
      state = true;
    },
    logout(state) {
      state = false;
    },
  },
});
export const loginActions = loginSlice.actions;
export default loginSlice.reducer;
