import { ArtworkImgType } from "../data/typeModels/artwork";

function ImagePathHelper(path: string) {
  return path.slice(path.indexOf("/Work/"));
}
function ImagePathListHelper(pathList: string[]) {
  return pathList.map((path: string) => ImagePathHelper(path));
}
function ArtworkImgListHelper(imgArr: ArtworkImgType[]) {
  const imgArrCopy = imgArr.map((img) => Object.assign({}, img));
  return imgArrCopy.map((img): ArtworkImgType => {
    return { id: img.id, content: ImagePathHelper(img.content) };
  });
}

export { ImagePathHelper, ImagePathListHelper, ArtworkImgListHelper };
