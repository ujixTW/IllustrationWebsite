import { Link } from "react-router-dom";
import style from "../assets/CSS/layouts/ArtworkBG.module.css";
import path from "../data/JSON/path.json";
import IconLong from "../assets/SVG/IconLong.svg?react";
import { ArtworkType } from "../data/typeModels/artwork";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { fromBackEndArtworkDataHelper } from "../utils/fromBackEndDataHelper";

export default function BeforeLoginLayOut(props: { children: JSX.Element }) {
  const bkDataList = useRef<ArtworkType[]>([]);
  const [bkData, setBkData] = useState<ArtworkType | undefined>(undefined);
  const bkIndex = useRef(0);

  useEffect(() => {
    const getBKData = async () => {
      await axios
        .get("/api/Work/GetList/Background")
        .then((res) => {
          const resData = res.data as ArtworkType[];
          const list = resData.map((item) =>
            fromBackEndArtworkDataHelper(item)
          );

          bkDataList.current.push(...list);
          setBkData(list[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getBKData();

    const changeBk = () => {
      bkIndex.current =
        bkIndex.current < bkDataList.current.length - 1
          ? bkIndex.current + 1
          : 0;
      setBkData(bkDataList.current[bkIndex.current]);
    };

    const interval = window.setInterval(changeBk, 30000);
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div
        className={`${style["bk"]} ${style["bk-img"]}`}
        style={{ backgroundImage: `url("${bkData?.imgs[0].artworkContent}")` }}
      ></div>
      <div className={style["content"]}>
        <div>
          <IconLong className={style["logo"]} />
        </div>
        {props.children}
      </div>
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
            <Link to={path.artworks.artwork + bkData.id}>
              <div>{bkData.title}</div>
              <div>{bkData.artistName}的作品</div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
