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

export type { userDataType, languageType, contryType };
