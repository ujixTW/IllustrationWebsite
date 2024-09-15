import { memo, useCallback, useState } from "react";
import style from "../../assets/CSS/components/Button/LikeBtn.module.css";
import LikeImg from "../../assets/SVG/like.svg?react";
import { asyncDebounce } from "../../utils/debounce";
import axios from "axios";

function LikeBtn(props: { artworkId: number; likeOrigin: boolean }) {
  const [isLike, setIsLike] = useState<boolean>(props.likeOrigin);

  const handelLike = useCallback(
    asyncDebounce(async () => {
      await axios
        .post("/api/Work/Like", props.artworkId)
        .then((res) => {
          const data: boolean = res.data;
          setIsLike(data);
          console.log(isLike);
        })
        .catch(() => alert("通訊錯誤，請稍後再試。"));
    }),
    [props.likeOrigin]
  );

  return (
    <div className={style["like"]}>
      <button
        type="button"
        className={style["btn-like"]}
        onClick={() => {
          handelLike();
        }}
      >
        <LikeImg
          className={
            style["icon-like"] + " " + (isLike ? style["is-like"] : "")
          }
        />
      </button>
    </div>
  );
}
export default memo(LikeBtn);
