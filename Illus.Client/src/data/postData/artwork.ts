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
  isOpen: boolean;
  imgs: File[];
  cover?: File;
  tags: string[];
};

const ArtworkPostDataDef: ArtworkPostData = {
  id: -1,
  title: "",
  description: "",
  isR18: false,
  isAI: false,
  postTime: new Date(),
  isOpen: true,
  imgs: [],
  cover: undefined,
  tags: [],
};

export { artworkOrderType };
export type { CommandPostData, ArtworkPostData };
export { ArtworkPostDataDef };
