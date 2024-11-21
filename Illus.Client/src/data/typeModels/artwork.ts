type TagType = { id: number; content: string };
type ArtworkImgType = { id: number; artworkContent: string };
type ArtworkType = {
  id: number;
  artistId: number;
  title: string;
  description: string;
  coverImg: string;
  likeCount: number;
  readCount: number;
  isLike: boolean;
  isR18: boolean;
  isAI: boolean;
  postTime: Date;
  artistName: string;
  artistHeadshotContent: string;
  tags: TagType[];
  imgs: ArtworkImgType[];
};
type ArtworkListType = {
  artworkList: ArtworkType[];
  maxCount: number;
  dailyTheme: string;
};
const ArtworkTypeDef: ArtworkType = {
  id: -1,
  artistId: -1,
  title: "",
  description: "",
  coverImg: "",
  likeCount: 0,
  readCount: 0,
  isLike: false,
  isR18: false,
  isAI: false,
  postTime: new Date(),
  artistName: "Artist Name",
  artistHeadshotContent: "/defaultImg/defaultHeadshot.svg",
  tags: [],
  imgs: [],
};
export {ArtworkTypeDef}
export type { TagType, ArtworkType, ArtworkImgType, ArtworkListType };
