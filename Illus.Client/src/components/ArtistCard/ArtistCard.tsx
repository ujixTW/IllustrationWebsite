import style from "../../assets/CSS/components/ArtistCard/ArtistCard.module.css";
import { memo, useEffect, useState } from "react";
import { userDataType } from "../../data/typeModels/user";
import axios from "axios";
import { Link } from "react-router-dom";
import path from "../../data/JSON/path.json";
import useFollowUser from "../../hooks/useFollowUser";
import { userDataHelper } from "../../utils/fromBackEndDataHelper";
import DropDown from "../DropDown";
import { useAppSelector } from "../../hooks/redux";

function ArtistCard(props: { artistId: number }) {
  const [data, setData] = useState<userDataType | undefined>(undefined);
  const userId = useAppSelector((state) => state.userData.id);
  const { followBtn, setIsFollow } = useFollowUser(props.artistId);

  useEffect(() => {
    axios
      .get(`/api/User/${props.artistId}`)
      .then((res) => setData(userDataHelper(res.data as userDataType)))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (data != undefined) setIsFollow(data.isFollow);
  }, [data]);

  return (
    <DropDown up>
      <div className={style["artist-detail"]}>
        <div
          className={style["cover"]}
          style={{ backgroundImage: `url("${data?.cover}")` }}
        ></div>
        <div className={style["content"]}>
          <div className={style["headshot"]}>
            <img
              className={style["head-img"]}
              src={data?.headshot}
              alt={data?.nickName}
            />
          </div>
          <div className={style["name"]}>
            {data?.nickName != "" ? data?.nickName : data.account}
          </div>
          <div className={style["profile"]}>
            {data?.profile}
            <Link to={path.user.user + props.artistId}>查看更多</Link>
          </div>
          <div className={style["follow"]}>
            {userId !== props.artistId && followBtn}
          </div>
        </div>
      </div>
    </DropDown>
  );
}

export default memo(ArtistCard);
