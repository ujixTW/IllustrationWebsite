import style from "../../assets/CSS/components/ArtistCard/ArtistCard.module.css";
import { memo, useCallback, useEffect, useState } from "react";
import { userDataType } from "../../data/typeModels/user";
import { asyncDebounce } from "../../utils/debounce";
import axios from "axios";
import { Link } from "react-router-dom";
import path from "../../data/JSON/path.json";
import CheckBtn from "../Button/CheckBtn";

function ArtistCard(props: { artistId: number }) {
  const [data, setData] = useState<userDataType | undefined>(undefined);
  const [isFollow, setIsFollow] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`/api/User/${props.artistId}`)
      .then((res) => setData(res.data as userDataType))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (data != undefined) setIsFollow(data.isFollow);
  }, [data]);

  const handelFollow = useCallback(
    asyncDebounce(() => {
      axios.post(`/api/User/Follow/${props.artistId}`).then(() => {
        const temp = data;
        if (temp != undefined) temp.isFollow = !temp.isFollow;
        setData(temp);
      });
    }),
    [isFollow]
  );
  return (
    <div className={style["artist-detail"]}>
      {data?.cover != "" && (
        <div
          className={style["cover"]}
          style={{ backgroundImage: `url("${data?.cover}")` }}
        ></div>
      )}
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
          <CheckBtn
            name={`follow${props.artistId}`}
            text={isFollow ? "已關注" : "關注"}
            onChange={() => {
              setIsFollow(!isFollow);
              handelFollow();
            }}
            checked={isFollow}
            hasBackground={true}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(ArtistCard);
