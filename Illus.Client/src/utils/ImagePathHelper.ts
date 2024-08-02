function ImagePathHelper(path: string) {
  return path.slice(-path.indexOf("public/"));
}
function ImagePathListHelper(pathList: string[]) {
  return pathList.map((path: string) => ImagePathHelper(path));
}

export { ImagePathHelper, ImagePathListHelper };
