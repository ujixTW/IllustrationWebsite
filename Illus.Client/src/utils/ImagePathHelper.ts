import { ArtworkImgType } from "../data/typeModels/artwork";

function IsDefaultImg(path: string) {
  return /^\/defaultImg\/\w+/.test(path);
}
function ImagePathHelper(path: string) {
  return IsDefaultImg(path) ? path : path.slice(path.indexOf("/Work/"));
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
async function ImagePathUrlToFile(_url: string, _name: string) {
  const url = ImagePathHelper(_url);
  const response = await fetch(url);
  if (response) {
    const blob = await response.blob();
    return new File([blob], `${_name}.png`, { type: blob.type });
  }
}

function ImagePathUrlListToFile(_urlArr: string[], _name: string) {
  return _urlArr.map((item, index) =>
    ImagePathUrlToFile(item, _name + " " + index)
  );
}

export {
  IsDefaultImg,
  ImagePathHelper,
  ImagePathListHelper,
  ArtworkImgListHelper,
  ImagePathUrlToFile,
  ImagePathUrlListToFile,
};
