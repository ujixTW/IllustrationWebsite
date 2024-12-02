type MessageType = {
  id: number;
  workId: number;
  userId: number;
  userNickName: string;
  userHeadshot: string;
  message: string;
  createTime: Date;
  isEdit: boolean;
};
export type { MessageType };
