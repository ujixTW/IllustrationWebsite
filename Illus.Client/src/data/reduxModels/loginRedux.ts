import { createSlice } from "@reduxjs/toolkit";

const initState = false;

const loginSlice = createSlice({
  name: "login",
  initialState: initState,
  reducers: {
    login(state) {
      return true;
    },
    logout(state) {
      return false;
    },
  },
});
export const loginActions = loginSlice.actions;
export default loginSlice.reducer;
