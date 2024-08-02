import { createContext } from "react";
import { userDataType } from "../data/typeModels/user";
export const defaultUserDataContextValue: userDataType = {
  id: -1,
  account: "dsaddas4dsd",
  email: "456dsad@gmail.com",
  nickName: "b45",
  profile: "iadgadkllkjdkalsjdkl",
  cover: "Work/img-costdown/0 cover.png",
  headshot: "Work/img-costdown/0 cover.png",
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
