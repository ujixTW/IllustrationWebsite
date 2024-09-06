import { createContext } from "react";
import { userDataType, userDataTypeDef } from "../data/typeModels/user";

export const UserDataContext = createContext({
  userData: userDataTypeDef,
  setUserData: (state: userDataType) => {},
});
