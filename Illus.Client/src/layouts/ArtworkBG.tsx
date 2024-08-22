import { Link } from "react-router-dom";
import style from "../assets/CSS/layouts/ArtworkBG.module.css";
import IconLong from "../assets/IconLong.svg?react";
import { ArtworkType } from "../data/typeModels/artwork";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BeforeLoginLayOut(props: { context: JSX.Element }) {
  const [bkDataList, setBkDataList] = useState<ArtworkType[]>([]);
  const [bkData, setBkData] = useState<ArtworkType | undefined>(undefined);
  const [bkIndex, setBkIndex] = useState<number>(0);

  useEffect(() => {
    axios
      .get("/api/GetList/Background")
      .then((res) => {
        const resData = res.data as ArtworkType[];
        setBkDataList(resData as ArtworkType[]);
        setBkData(resData[0] as ArtworkType);

        const changeBk = () =>
          setBkIndex(bkIndex < resData.length - 1 ? bkIndex + 1 : 0);
        const interval = window.setInterval(changeBk, 30000);
        return window.clearInterval(interval);
      })
      .catch((err) => {
        console.log(err);
      });

    const changeBk = () =>
      setBkIndex(bkIndex < bkDataList.length - 1 ? bkIndex + 1 : 0);

    const interval = window.setInterval(changeBk, 30000);
    return window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setBkData(bkDataList[bkIndex]);
  }, [bkIndex]);

  return (
    <>
      <div
        className={`${style["bk"]} ${style["bk-img"]}`}
        style={{ backgroundImage: `url("${bkData?.imgs[0].content}")` }}
      >
        <div className={style["artist"]}>
          <div>
            <Link to={`/user/${bkData?.artistId}`}>
              <div
                className={`${style["headshot"]} ${style["bk-img"]}`}
                style={{
                  backgroundImage: `url("${bkData?.artistHeadshotContent}")`,
                }}
              ></div>
            </Link>
          </div>
          {bkData != undefined && (
            <div>
              <Link to={`/artwork/${bkData.artistId}`}>
                <div>{bkData.title}</div>
                <div>{bkData.artistName}的作品</div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className={style["content"]}>
        <div>
          <IconLong className={style["logo"]} />
        </div>
        {props.context}
      </div>
    </>
  );
}
