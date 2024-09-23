import { createContext } from "react";

const ArtworkContext = createContext({
  imgId: -1,
  imgIndex: 1,
  showMore: false,
  setImgId: (state: number) => {},
  setImgIndex: (state: number) => {},
  setShowMore: (state: boolean) => {},
});
export { ArtworkContext };
