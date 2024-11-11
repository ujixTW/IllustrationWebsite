import { userDataType } from "../data/typeModels/user";
import { ImagePathHelper } from "./ImagePathHelper";

function userHeadshotHelper(headshot: string | undefined) {
  return headshot === undefined || headshot.trim() === ""
    ? "/defaultImg/defaultHeadshot.svg"
    : ImagePathHelper(headshot);
}
function userDataHelper(data: userDataType) {
  const dataCopy = Object.assign({}, data);

  dataCopy.headshot = userHeadshotHelper(dataCopy.headshot);

  dataCopy.cover =
    dataCopy.cover === undefined || dataCopy.cover.trim() === ""
      ? ""
      : ImagePathHelper(dataCopy.cover);

  if (dataCopy.nickName.trim() == "") dataCopy.nickName = dataCopy.account;

  return dataCopy;
}

export { userHeadshotHelper };
export default userDataHelper;
