import { artworkOrderType } from "../data/postData/artwork";

const keywordReg = /keywords=[^&]+/;
const pageReg = /p=[0-9]+/i;
const orderReg = /order=(hot%2Bdesc|hot|time%2Bdesc)/i;
const descReg = /desc/i;
const r18Reg = /R18=show/i;
const AIReg = /AI=show/i;

const keywordParma = "keywords";
const pageParma = "p";
const orderParma = "order";
const r18Parma = "R18";
const AIParma = "AI";

const show = "show";

const artworkParmas = {
  keyword: keywordParma,
  page: pageParma,
  order: orderParma,
  r18: r18Parma,
  ai: AIParma,
};

const artworkParmasValue = {
  orderType: (type: artworkOrderType, desc: boolean): string => {
    const descStr = desc ? "+desc" : "";
    switch (type) {
      case artworkOrderType.hot:
        return "hot" + descStr;
      case artworkOrderType.postTime:
        return "time" + descStr;
      default:
        return "hot";
    }
  },
  r18: show,
  ai: show,
};

export { keywordReg, pageReg, orderReg, descReg, r18Reg, AIReg };
export { keywordParma, pageParma, orderParma, r18Parma, AIParma };
export { artworkParmas, artworkParmasValue };
