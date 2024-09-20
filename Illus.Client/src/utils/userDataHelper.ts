import { userDataType } from "../data/typeModels/user";
import { ImagePathHelper } from "./ImagePathHelper";

function userHeadshotHelper(headshot: string) {
  return headshot.trim() != ""
    ? ImagePathHelper(headshot)
    : "/defaultImg/defaultHeadshot.svg";
}
function userDataHelper(data: userDataType) {
  const dataCopy = Object.assign({}, data);

  dataCopy.headshot =
    dataCopy.headshot.trim() != ""
      ? ImagePathHelper(dataCopy.headshot)
      : "/defaultImg/defaultHeadshot.svg";

  dataCopy.cover =
    dataCopy.cover.trim() != "" ? ImagePathHelper(dataCopy.cover) : "";

  if (dataCopy.nickName.trim() == "") dataCopy.nickName = dataCopy.account;

  return dataCopy;
}

export { userHeadshotHelper };
export default userDataHelper;
