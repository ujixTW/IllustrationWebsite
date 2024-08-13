type TagType = { id: number; content: string };
type ArtworkImgType = { id: number; content: string };
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
  type: number;
};
export enum ArtworkListTypeData{
  HOT = 0,
  DAILY = 1,
  FOLLOW = 2,
}
export type { TagType, ArtworkType, ArtworkImgType, ArtworkListType };
