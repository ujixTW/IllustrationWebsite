import { createSlice } from "@reduxjs/toolkit";

export type ArtworkCateType = {
  isAI: boolean;
  isR18: boolean;
};

const initState: ArtworkCateType = {
  isAI: false,
  isR18: false,
};

const artworkCateSlice = createSlice({
  name: "artworkCate",
  initialState: initState,
  reducers: {
    switchAI(state) {
      state.isAI = !state.isAI;
      return state;
    },
    switchR18(state) {
      state.isR18 = !state.isR18;
      return state;
    },
  },
});

export const artworkCateActions = artworkCateSlice.actions;
export default artworkCateSlice.reducer;
