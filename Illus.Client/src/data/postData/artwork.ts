enum artworkOrderType {
  postTime = 0,
  hot = 1,
}
type CommandPostData = {
  id: number;
  workId: number;
  message: string;
};

export { artworkOrderType };
export type { CommandPostData };
