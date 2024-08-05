import { Link } from "react-router-dom";
import style from "../assets/CSS/layouts/BeforeLoginLayout.module.css";
import { ArtworkDetailType } from "../data/typeModels/artwork";
import { useEffect, useState } from "react";
import axios from "axios";

const defaultData: ArtworkDetailType = {
  id: -1,
  artistId: -1,
  title: "預設的作品名",
  description: "",
  coverImg: "",
  likeCount: 0,
  readCount: 0,
  isLike: false,
  isR18: false,
  isAI: false,
  postTime: new Date(),
  artistName: "預設的人",
  artistHeadshotContent: "/defaultImg/defaultHeadshot.svg",
  tags: [],
  imgs: [{ id: -1, content: "/Work/img-costdown/0 cover.png" }],
};

export default function BeforeLoginLayOut(props: { context: JSX.Element }) {
  const [bkDataList, setBkDataList] = useState<ArtworkDetailType[]>([
    defaultData,
  ]);
  const [bkData, setBkData] = useState<ArtworkDetailType>(defaultData);
  const [bkIndex, setBkIndex] = useState<number>(0);

  useEffect(() => {
    // axios
    //   .get("/api/GetList/Background")
    //   .then((res) => {
    //     const resData = res.data as ArtworkDetailType[];
    //     setBkDataList(resData as ArtworkDetailType[]);
    //     setBkData(resData[0] as ArtworkDetailType);

    //     const changeBk = () =>
    //       setBkIndex(bkIndex < resData.length - 1 ? bkIndex + 1 : 0);
    //     const interval = window.setInterval(changeBk, 30000);
    //     return window.clearInterval(interval);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    const changeBk = () =>
      setBkIndex(bkIndex < bkDataList.length - 1 ? bkIndex + 1 : 0);
    const interval = window.setInterval(changeBk, 30000);
    return window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setBkData(bkDataList[bkIndex]);
  }, [bkIndex]);

  return (
    <div
      className={`${style["bk"]} ${style["bk-img"]}`}
      style={{ backgroundImage: `url("${bkData.imgs[0].content}")` }}
    >
      <div className={style["content"]}>{props.context}</div>
      <div className={style["artist"]}>
        <div>
          <Link to={`/user/${bkData.artistId}`}>
            <div
              className={`${style["headshot"]} ${style["bk-img"]}`}
              style={{
                backgroundImage: `url("${bkData.artistHeadshotContent}")`,
              }}
            ></div>
          </Link>
        </div>
        <div>
          <Link to={`/artwork/${bkData.artistId}`}>
            <div>{bkData.title}</div>
            <div>{bkData.artistName}的作品</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
