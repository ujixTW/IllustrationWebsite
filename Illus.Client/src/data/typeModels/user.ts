type userDataType = {
  id: number;
  account: string;
  email: string;
  nickName: string;
  profile: string;
  cover: string;
  headshot: string;
  isFollow: boolean;
  followerCount: number;
  followingCount: number;
  language: languageType;
  contry: contryType;
};
type languageType = { id: number; content: string };
type contryType = { id: number; content: string };
const languageTypeDef = { id: 0, content: "繁體中文" };
const contryTypeDef = { id: 0, content: "台灣" };
const userDataTypeDef = {
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
  language: languageTypeDef,
  contry: contryTypeDef,
};

export { userDataTypeDef, languageTypeDef, contryTypeDef };
export type { userDataType, languageType, contryType };
