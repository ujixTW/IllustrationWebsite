import { ArtworkType } from "./artwork";

type userDataType = {
  id: number;
  account: string;
  email: string;
  nickName: string;
  profile: string;
  cover: string;
  headshot: string;
  isFollow: boolean;
  emailConfirm: boolean;
  followerCount: number;
  followingCount: number;
  language: languageType;
  country: countryType;
  artworkList?: ArtworkType[];
};
type languageType = { id: number; content: string };
type countryType = { id: number; content: string };
type followListType = {
  users: userDataType[];
  count: number;
};
type loginCheckType = {
  userData: userDataType;
  isLogin: boolean;
};
const languageTypeDef = { id: 1, content: "繁體中文" };
const contryTypeDef = { id: 1, content: "台灣" };
const userDataTypeDef: userDataType = {
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
  language: languageTypeDef,
  country: contryTypeDef,
};

export { userDataTypeDef, languageTypeDef, contryTypeDef };
export type {
  userDataType,
  languageType,
  countryType,
  followListType,
  loginCheckType,
};
