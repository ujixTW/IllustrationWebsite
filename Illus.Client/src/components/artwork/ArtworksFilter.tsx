import { useEffect, useState } from "react";
import style from "../../assets/CSS/components/artwork/ArtworksFilter.module.css";
import CheckBtn from "../Button/CheckBtn";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  artworkParmas,
  AIReg,
  artworkParmasValue,
  r18Reg,
  orderReg,
  descReg,
} from "../../utils/parmasHelper";
import { artworkOrderType } from "../../data/postData/artwork";

export default function ArtworksFilter(props: {
  hasOrder?: boolean;
  switchAI?: boolean;
  switchR18?: boolean;
}) {
  const [isAI, setIsAI] = useState(false);
  const [isR18, setIsR18] = useState(false);
  const [order, setOrder] = useState<artworkOrderType>(
    artworkOrderType.postTime
  );
  const [isDesc, setIsDesc] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const orderCheckedIcon = isDesc ? "▴" : "▾";

  useEffect(() => {
    setIsAI(AIReg.test(location.search));
    setIsR18(r18Reg.test(location.search));
    if (orderReg.test(location.search)) {
      const tempStr = location.search.match(orderReg);
      if (tempStr != null) {
        setIsDesc(descReg.test(tempStr[0]));
        setOrder(
          /hot/.test(tempStr[0])
            ? artworkOrderType.hot
            : artworkOrderType.postTime
        );
      }
    } else {
      setOrder(artworkOrderType.postTime);
      setIsDesc(false);
    }
  }, [location.search]);

  const aiHandler = () => {
    if (searchParams.has(artworkParmas.ai)) {
      searchParams.delete(artworkParmas.ai);
    }
    if (!isAI) {
      searchParams.append(artworkParmas.ai, artworkParmasValue.ai);
    }

    setSearchParams(searchParams);
  };
  const r18Handler = () => {
    if (searchParams.has(artworkParmas.r18)) {
      searchParams.delete(artworkParmas.r18);
    }
    if (!isR18) {
      searchParams.append(artworkParmas.r18, artworkParmasValue.r18);
    }
    setSearchParams(searchParams);
  };
  const orderHandler = (type: artworkOrderType) => {
    let desc = type != order ? false : !isDesc;

    const orderKey = artworkParmas.order;
    const orderValue = artworkParmasValue.orderType(type, desc);

    switch (type) {
      case artworkOrderType.postTime:
        if (searchParams.has(orderKey)) {
          searchParams.delete(orderKey);
        } else {
          searchParams.append(orderKey, orderValue);
        }
        break;
      case artworkOrderType.hot:
        if (searchParams.has(orderKey)) {
          console.log(orderValue);

          searchParams.set(orderKey, orderValue);
        } else {
          searchParams.append(orderKey, orderValue);
        }
        break;
      default:
        break;
    }
    setSearchParams(searchParams);
  };

  return (
    <nav className={style["filter"]}>
      {props.hasOrder && (
        <div className={style["side-start"] + " " + style["option-bar"]}>
          <div>
            <CheckBtn
              name="order"
              text={`按時間排序 ${
                order == artworkOrderType.postTime ? orderCheckedIcon : "⇅"
              }`}
              onChange={() => orderHandler(artworkOrderType.postTime)}
              checked={order == artworkOrderType.postTime}
              hasBackground={false}
            />
          </div>
          <div>
            <CheckBtn
              name="order"
              text={`按熱門度排序 ${
                order == artworkOrderType.hot ? orderCheckedIcon : "⇅"
              }`}
              onChange={() => orderHandler(artworkOrderType.hot)}
              checked={order == artworkOrderType.hot}
              hasBackground={false}
            />
          </div>
        </div>
      )}

      <div className={style["side-end"] + " " + style["option-bar"]}>
        {props.switchAI && (
          <div>
            <CheckBtn
              name="isAI"
              text="AI"
              onChange={aiHandler}
              checked={isAI}
              hasBackground={false}
            />
          </div>
        )}
        {props.switchR18 && (
          <div>
            <CheckBtn
              name="isR18"
              text="R-18"
              onChange={r18Handler}
              checked={isR18}
              hasBackground={false}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
