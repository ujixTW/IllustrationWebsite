import { userDataType } from "../data/typeModels/user";
import { ImagePathHelper } from "./ImagePathHelper";

function userHeadshotHelper(headshot: string | null) {
  return headshot === null || headshot.trim() === ""
    ? "/defaultImg/defaultHeadshot.svg"
    : ImagePathHelper(headshot);
}
function userDataHelper(data: userDataType) {
  const dataCopy = Object.assign({}, data);

  dataCopy.headshot = userHeadshotHelper(dataCopy.headshot);

  dataCopy.cover =
    dataCopy.cover === null || dataCopy.cover.trim() === ""
      ? ""
      : ImagePathHelper(dataCopy.cover);

  if (dataCopy.nickName.trim() == "") dataCopy.nickName = dataCopy.account;
  if (dataCopy.profile === null) dataCopy.profile = "";
  return dataCopy;
}

export { userHeadshotHelper };
export default userDataHelper;
