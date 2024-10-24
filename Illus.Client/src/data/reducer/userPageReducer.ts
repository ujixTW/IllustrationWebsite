import {
  editUserDataPostData,
  editUserDataPostDataDef,
} from "../postData/account";
import { ArtworkListType } from "../typeModels/artwork";
import { userDataType } from "../typeModels/user";

type userPageActType =
  | { type: "setUserData"; payload: userDataType }
  | { type: "setIsOwn"; payload: boolean }
  | { type: "setArtworkList"; payload: ArtworkListType }
  | { type: "setIsEdit"; payload: boolean }
  | { type: "setIsShowDetail"; payload: boolean }
  | { type: "setIsLoading"; payload: boolean }
  | { type: "setUserPostData"; payload: editUserDataPostData }
  | { type: "setUserPostDataFromUserData"; payload: userDataType }
  | { type: "setIsEditNicknameErr"; payload: boolean }
  | { type: "setPage"; payload: number };

type userPageStateType = {
  userData?: userDataType;
  isOwn: boolean;
  artworkList: ArtworkListType;
  isEdit: boolean;
  isShowDetail: boolean;
  isLoading: boolean;
  userPostData: editUserDataPostData;
  isEditNicknameErr: boolean;
  page: number;
};
const userPageStateDef: userPageStateType = {
  isOwn: false,
  artworkList: { artworkList: [], maxCount: 0, dailyTheme: "" },
  isEdit: false,
  isShowDetail: false,
  isLoading: false,
  userPostData: editUserDataPostDataDef,
  isEditNicknameErr: false,
  page: 0,
};
const userPageReducer = function (
  state: userPageStateType,
  action: userPageActType
) {
  const copyState = Object.assign({}, state);
  const { type, payload } = action;
  switch (type) {
    case "setUserData":
      copyState.userData = payload;
      return copyState;
    case "setIsOwn":
      copyState.isOwn = payload;
      return copyState;
    case "setArtworkList":
      copyState.artworkList = payload;
      return copyState;
    case "setIsEdit":
      copyState.isEdit = payload;
      return copyState;
    case "setIsShowDetail":
      copyState.isShowDetail = payload;
      return copyState;
    case "setIsLoading":
      copyState.isLoading = payload;
      return copyState;
    case "setUserPostData":
      copyState.userPostData = payload;
      return copyState;
    case "setUserPostDataFromUserData":
      const postDataFromUserData: editUserDataPostData = {
        id: payload.id,
        nickName: payload.nickName,
        profile: payload.profile,
        languageID: payload.language.id,
        countryID: payload.contry.id,
      };
      copyState.userPostData = postDataFromUserData;
      return copyState;
    case "setIsEditNicknameErr":
      copyState.isEditNicknameErr = payload;
      return copyState;
    case "setPage":
      copyState.page = payload;
      return copyState;
    default:
      throw new Error("Wrong action type!");
  }
};

export { userPageStateDef, userPageReducer };
