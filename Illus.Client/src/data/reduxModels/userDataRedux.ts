import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userDataType } from "../typeModels/user";
import userDataHelper from "../../utils/userDataHelper";

const initState: userDataType = {
  id: -1,
  account: "",
  email: "",
  nickName: "",
  profile: "",
  cover: "",
  headshot: "/defaultImg/defaultHeadshot.svg",
  isFollow: false,
  emailConfirm: false,
  followerCount: 0,
  followingCount: 0,
  language: { id: 0, content: "" },
  country: { id: 0, content: "" },
};

const userDataSlice = createSlice({
  name: "userData",
  initialState: initState,
  reducers: {
    setUserData: (state, actions: PayloadAction<userDataType>) => {
      const data = userDataHelper(actions.payload);
      return data;
    },
    logout() {
      return initState;
    },
  },
});
export const userDataActions = userDataSlice.actions;
export default userDataSlice.reducer;
