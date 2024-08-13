import { createSlice } from "@reduxjs/toolkit";

const initState = { value: false };

const loginSlice = createSlice({
  name: "login",
  initialState: initState,
  reducers: {
    login(state) {
      state.value = true;
    },
    logout(state) {
      state.value = false;
    },
  },
});
export const loginActions = loginSlice.actions;
export default loginSlice.reducer;
