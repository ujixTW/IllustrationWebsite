import { TagType } from "../typeModels/artwork";

enum artworkOrderType {
  postTime = 0,
  hot = 1,
}
type CommandPostData = {
  id: number;
  workId: number;
  message: string;
};
type ArtworkPostData = {
  id: number;
  title: string;
  description: string;
  isR18: boolean;
  isAI: boolean;
  postTime: Date;
  imgs: File[];
  cover?: File;
  tags: TagType[];
};

const ArtworkPostDataDef: ArtworkPostData = {
  id: -1,
  title: "",
  description: "",
  isR18: false,
  isAI: false,
  postTime: new Date(),
  imgs: [],
  cover: undefined,
  tags: [],
};

export { artworkOrderType };
export type { CommandPostData, ArtworkPostData };
export { ArtworkPostDataDef };
