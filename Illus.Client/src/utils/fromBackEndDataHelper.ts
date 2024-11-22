import { ArtworkListType, ArtworkType } from "../data/typeModels/artwork";
import { MessageType } from "../data/typeModels/message";
import { userDataType } from "../data/typeModels/user";
import { ImagePathHelper } from "./ImagePathHelper";

// userData
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
export { userDataHelper, userHeadshotHelper };

//artwork data
function fromBackEndArtworkDataHelper(beData: ArtworkType) {
  const dataCopy = Object.assign({}, beData);
  dataCopy.postTime = new Date(beData.postTime);
  return dataCopy;
}
function fromBackEndArtworkListDataHelper(beData: ArtworkListType) {
  const dataCopy = Object.assign({}, beData);
  dataCopy.artworkList = dataCopy.artworkList.map((item) =>
    fromBackEndArtworkDataHelper(item)
  );
  return dataCopy;
}
export { fromBackEndArtworkDataHelper, fromBackEndArtworkListDataHelper };

//massage data
function fromBackEndMessageDataHelper(beData: MessageType) {
  const dataCopy = Object.assign({}, beData);
  dataCopy.createTime = new Date(beData.createTime);
  return dataCopy;
}
function fromBackEndMessageListDataHelper(beData: MessageType[]) {
  return beData.map((item) => fromBackEndMessageDataHelper(item));
}
export { fromBackEndMessageDataHelper, fromBackEndMessageListDataHelper };
