type loginPostData = {
  account: string;
  password: string;
  email: string;
};
type editPasswordPostData = {
  oldPWD: string;
  newPWD: string;
  newPWDAgain: string;
};
type editPWDFromEmailPostData = {
  email: string;
  CAPTCHA: string;
  passwordCommand: editPasswordPostData;
};
type editUserDataPostData = {
  id: number;
  nickName: string;
  profile: string;
  cover?: File;
  headshot?: File;
  languageID: number;
  countryID: number;
};
export type {
  loginPostData,
  editPasswordPostData,
  editPWDFromEmailPostData,
  editUserDataPostData,
};
