import { createContext } from "react";
import { userDataType } from "../data/typeModels/user";
export const defaultUserDataContextValue: userDataType = {
  id: -1,
  account: "",
  email: "",
  nickName: "",
  profile: "",
  cover: "",
  headshot: "/defaultImg/defaultHeadshot.svg",
  isFollow: false,
  followerCount: 0,
  followingCount: 0,
  language: { id: -1, content: "" },
  contry: { id: -1, content: "" },
};
export const IsLoginContext = createContext({
  isLogin: false,
  setIsLogin: (state:boolean) => {},
});
export const UserDataContext = createContext({
  userData: defaultUserDataContextValue,
  setUserData: (state:userDataType) => {},
});
