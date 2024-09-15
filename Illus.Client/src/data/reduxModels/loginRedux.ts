import { createSlice } from "@reduxjs/toolkit";

const initState = { isLogin: false, userId: -1 };

const loginSlice = createSlice({
  name: "login",
  initialState: initState,
  reducers: {
    login(state, actions) {
      if (typeof actions.payload != "number") return state;
      return { isLogin: true, userId: actions.payload };
    },
    logout() {
      return { isLogin: false, userId: initState.userId };
    },
  },
});
export const loginActions = loginSlice.actions;
export default loginSlice.reducer;
