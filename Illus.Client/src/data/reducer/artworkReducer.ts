import { ArtworkPostData } from "../postData/artwork";
import { TagType } from "../typeModels/artwork";

type artworkPostReducerAct =
  | { type: "setId"; payload: number }
  | { type: "addImg"; payload: FileList }
  | { type: "editImg"; payload: File[] }
  | { type: "editCover"; payload: File }
  | { type: "editTitle"; payload: string }
  | { type: "editDescription"; payload: string }
  | { type: "editIsR18"; payload: boolean }
  | { type: "editIsAI"; payload: boolean }
  | { type: "editPostTime"; payload: Date }
  | { type: "addTag"; payload: TagType }
  | { type: "editTag"; payload: TagType[] };

const artworkPostReducer = function (
  state: ArtworkPostData,
  action: artworkPostReducerAct
) {
  const copyState = Object.assign({}, state);
  switch (action.type) {
    case "setId":
      copyState.id = copyState.id;
      return copyState;
    case "addImg":
      copyState.imgs = copyState.imgs.concat([...action.payload]);
      return copyState;
    case "editImg":
      copyState.imgs = action.payload;
      return copyState;
    case "editCover":
      copyState.cover = action.payload;
      return copyState;
    case "editTitle":
      copyState.title = action.payload;
      return copyState;
    case "editDescription":
      copyState.description = action.payload;
      return copyState;
    case "editIsR18":
      copyState.isR18 = action.payload;
      return copyState;
    case "editIsAI":
      copyState.isAI = action.payload;
      return copyState;
    case "editPostTime":
      copyState.postTime = action.payload;
      return copyState;
    case "addTag":
      copyState.tags = copyState.tags.concat(action.payload);
      return copyState;
    case "editTag":
      copyState.tags = [...action.payload];
      return copyState;

    default:
      throw new Error("Wrong action type!");
  }
};
export type { artworkPostReducerAct };
export { artworkPostReducer };
