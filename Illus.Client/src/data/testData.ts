import { ArtworkType } from "./typeModels/artwork";
import { userDataType } from "./typeModels/user";

const testArtwork: ArtworkType = {
  id: -1,
  artistId: -1,
  title: "預設的作品名",
  description:
    "對這件作品的簡述 對這件作品的簡述 對這件作品的簡述 對這件作品的簡述 ",
  coverImg:
    "D:/My Works/2024/code/IllustrationWebsite/IllustrationWebsite/Illus.Client/public/Work/img-costdown/0 cover.png",
  likeCount: 0,
  readCount: 0,
  isLike: false,
  isR18: false,
  isAI: false,
  postTime: new Date(),
  artistName: "預設的人",
  artistHeadshotContent: "/defaultImg/defaultHeadshot.svg",
  tags: [
    { id: 1, content: "狐狸" },
    { id: 2, content: "LOL" },
  ],
  imgs: [
    {
      id: 0,
      content:
        "D:/My Works/2024/code/IllustrationWebsite/IllustrationWebsite/Illus.Client/public/Work/img-costdown/0 cover.png",
    },
  ],
};
const testUser: userDataType = {
  id: -1,
  account: "account",
  email: "email@123.com",
  nickName: "nickName",
  profile: "profile profile profile profile profile profile profile ",
  cover:
    "D:/My Works/2024/code/IllustrationWebsite/IllustrationWebsite/Illus.Client/public/Work/img-costdown/0 cover.png",
  headshot: "/defaultImg/defaultHeadshot.svg",
  isFollow: false,
  emailConfirm: false,
  followerCount: 0,
  followingCount: 0,
  language: { id: 0, content: "chinese" },
  contry: { id: 0, content: "Taiwan" },
};

export { testArtwork, testUser };
