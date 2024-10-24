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
const editUserDataPostDataDef: editUserDataPostData = {
  id: -1,
  nickName: "",
  profile: "",
  languageID: -1,
  countryID: -1,
};
export type {
  loginPostData,
  editPasswordPostData,
  editPWDFromEmailPostData,
  editUserDataPostData,
};
export { editUserDataPostDataDef };
