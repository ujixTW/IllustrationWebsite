import { memo, useCallback, useEffect, useRef, useState } from "react";
import style from "../assets/CSS/components/TimePicker.module.css";
import Arrow from "../assets/SVG/arrow.svg?react";
import {
  ChangeEvent,
  ClickBtnEvent,
  KeyInputEvent,
} from "../utils/tsTypesHelper";
import DropDown from "./DropDown";
import { formatISOTimeString } from "../utils/dateHelper";
import { htmlReg } from "../utils/regexHelper";

type dateType = "year" | "month" | "day";

function SelectPage(props: {
  value: number;
  minDisable?: number;
  maxDisable?: number;
  minValue: number;
  maxValue: number;
  type?: dateType;
  unit?: string;
  grid?: boolean;
  onClick: (_num: number) => void;
}) {
  const [btnArr, setBtnArr] = useState<JSX.Element[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tempArr: JSX.Element[] = [];
    for (let i = props.minValue; i < props.maxValue + 1; i++) {
      const isDisable =
        ((props.minDisable && i < props.minDisable) as boolean) ||
        ((props.maxDisable && i > props.maxDisable) as boolean);

      tempArr.push(
        <div
          key={"select" + i + (props.unit ? props.unit : "")}
          className={style["btn-box"]}
        >
          <button
            type="button"
            className={
              style["btn"] + (i === props.value ? " " + style["active"] : "")
            }
            onClick={(e: ClickBtnEvent) => {
              e.preventDefault();
              e.stopPropagation();
              props.onClick(i);
            }}
            disabled={isDisable}
          >
            {i + (props.unit ? props.unit : "")}
          </button>
        </div>
      );
    }

    setBtnArr(tempArr);
  }, [props]);
  useEffect(() => {
    if (btnArr.length === 0 || props.grid || !pageRef.current) return;
    const el = pageRef.current;

    const target = el.getElementsByClassName(style["btn"])[props.value];
    target.scrollIntoView({ behavior: "instant", block: "center" });
  }, [btnArr]);

  return (
    <div
      ref={pageRef}
      className={
        style["select-page"] +
        " " +
        style[props.type ? props.type : "default"] +
        " " +
        style[props.grid ? "grid" : "list"]
      }
    >
      {btnArr}
    </div>
  );
}
function DateSeleteBar(props: {
  value: number;
  minDisable?: number;
  maxDisable?: number;
  type: "year" | "month";
  onChange: (_num: number) => void;
}) {
  const [max, setMax] = useState(1);
  const [min, setMin] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [unit, setUnit] = useState("");
  const [showList, setShowList] = useState(false);
  const pageCount = 12;

  useEffect(() => {
    switch (props.type) {
      case "month":
        setMin(1);
        setMax(12);
        setUnit("月");
        break;
      case "year":
        setUnit("年");
        break;
      default:
        return;
    }
  }, []);

  useEffect(() => {
    if (showList && props.type === "year") {
      setMin(pageCount * pageIndex + 1);
      setMax(pageCount * (pageIndex + 1));
    }
  }, [pageIndex]);

  return (
    <div className={style["select-bar"]}>
      <div className={style["bar"]}>
        <div className={style["back"]}>
          <button
            type="button"
            className={style["btn"]}
            onClick={() => {
              if (props.value > 1) props.onChange(props.value - 1);
              else props.onChange(max);
            }}
            disabled={
              (props.minDisable && props.minDisable === props.value) as boolean
            }
          >
            <Arrow />
          </button>
        </div>

        <div className={style["page-index"]}>
          <button
            type="button"
            className={style["btn"]}
            onClick={() => {
              setShowList(true);
              if (props.type === "year")
                setPageIndex(Math.floor(props.value / pageCount));
            }}
          >
            {props.value + " " + unit}
          </button>
        </div>

        <div className={style["next"]}>
          <button
            type="button"
            className={style["btn"]}
            onClick={() => {
              if (props.value < max || props.type === "year")
                props.onChange(props.value + 1);
              else props.onChange(1);
            }}
            disabled={
              (props.maxDisable && props.maxDisable === props.value) as boolean
            }
          >
            <Arrow />
          </button>
        </div>
      </div>
      {showList && (
        <div className={style["selecter"]}>
          {props.type === "year" && (
            <div className={style["bar"]}>
              <div className={style["back"]}>
                <button
                  type="button"
                  className={style["btn"]}
                  onClick={() => {
                    if (pageIndex > 0) setPageIndex(pageIndex - 1);
                    else setPageIndex(0);
                  }}
                  disabled={
                    pageIndex <= 0 ||
                    ((props.minDisable && props.minDisable >= min) as boolean)
                  }
                >
                  <Arrow />
                </button>
              </div>
              <div
                className={style["page-index"]}
              >{`${min} 年 - ${max} 年`}</div>
              <div className={style["next"]}>
                <button
                  type="button"
                  className={style["btn"]}
                  onClick={() => setPageIndex(pageIndex + 1)}
                  disabled={
                    (props.maxDisable && props.maxDisable <= max) as boolean
                  }
                >
                  <Arrow />
                </button>
              </div>
            </div>
          )}
          <div className={style["content"] + " " + style[props.type]}>
            <SelectPage
              type={props.type}
              value={props.value}
              minDisable={props.minDisable}
              maxDisable={props.maxDisable}
              minValue={min}
              maxValue={max}
              unit={unit}
              grid
              onClick={(_num: number) => {
                props.onChange(_num);
                setShowList(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
function DateSeleter(props: {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (...args: any[]) => void;
  closeFnc: (...args: any[]) => void;
}) {
  const dayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const [year, setYear] = useState(2000);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [targetMonthDay, setTargetMonthDay] = useState(31);
  const [lessRange, setLessRange] = useState<dateType>();
  const [overRange, setOverRange] = useState<dateType>();
  const dateRef = useRef<Date>();

  useEffect(() => {
    const _date = props.value;
    setYear(_date.getFullYear());
    setMonth(_date.getMonth() + 1);
    setDay(_date.getDate());
    dateRef.current = new Date(_date);
  }, [props.value]);

  useEffect(() => {
    if (
      month === 2 &&
      ((year % 4 === 0 && year % 100 > 0) ||
        year % 400 === 0 ||
        year % 1000 === 0)
    ) {
      setTargetMonthDay(29);
    } else {
      setTargetMonthDay(dayOfMonth[month - 1]);
    }

    const _min = props.minDate;
    const _max = props.maxDate;
    if (_min && year <= _min.getFullYear()) {
      setLessRange(month - 1 <= _min.getMonth() ? "month" : "year");
    }
    if (_max && year >= _max.getFullYear()) {
      setOverRange(month - 1 >= _max.getMonth() ? "month" : "year");
    }
  }, [year, month]);

  const handleChange = useCallback(
    (_num: number, _type: dateType) => {
      if (!dateRef.current) return;
      const _date = dateRef.current;
      switch (_type) {
        case "day":
          _date.setDate(_num);
          break;
        case "month":
          _date.setMonth(_num - 1);
          break;
        case "year":
          _date.setFullYear(_num);
          break;
        default:
          throw new Error("Wrong type");
      }
      props.onChange(_date);
    },
    [props.onChange, props.value]
  );

  return (
    <div className={style["date"]}>
      <div className={style["year"]}>
        <DateSeleteBar
          value={year}
          minDisable={props.minDate?.getFullYear()}
          maxDisable={props.maxDate?.getFullYear()}
          type="year"
          onChange={(_num: number) => handleChange(_num, "year")}
        />
      </div>
      <div className={style["mounth"]}>
        <DateSeleteBar
          value={month}
          minDisable={
            lessRange && props.minDate
              ? props.minDate.getMonth() + 1
              : undefined
          }
          maxDisable={
            overRange && props.maxDate
              ? props.maxDate.getMonth() + 1
              : undefined
          }
          type="month"
          onChange={(_num: number) => handleChange(_num, "month")}
        />
      </div>
      <div className={style["day"]}>
        <SelectPage
          type="day"
          value={day}
          minDisable={
            lessRange === "month" ? props.minDate?.getDate() : undefined
          }
          maxDisable={
            overRange === "month" ? props.maxDate?.getDate() : undefined
          }
          minValue={1}
          maxValue={targetMonthDay}
          unit=""
          grid
          onClick={(_num: number) => {
            handleChange(_num, "day");
            props.closeFnc();
          }}
        />
      </div>
    </div>
  );
}

function TimeSelecter(props: {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (...args: any[]) => void;
  closeFnc: (...args: any[]) => void;
}) {
  const dateRef = useRef<Date>();
  const [minHour, setMinHour] = useState<number>();
  const [minMinute, setMinMinute] = useState<number>();
  const [maxHour, setMaxHour] = useState<number>();
  const [maxMinute, setMaxMinute] = useState<number>();

  useEffect(() => {
    const value = props.value;
    dateRef.current = new Date(value);
    const _timeOfOneDay = 1000 * 60 * 60 * 24;
    if (props.minDate) {
      const min = props.minDate;
      const offset = value.getTime() - min.getTime();

      if (offset < _timeOfOneDay) {
        setMinHour(min.getHours());
        setMinMinute(
          value.getHours() <= min.getHours() ? min.getMinutes() : undefined
        );
      }
    }
    if (props.maxDate) {
      const max = props.maxDate;
      const offset = max.getTime() - value.getTime();

      if (offset < _timeOfOneDay) {
        setMaxHour(max.getHours());
        setMaxMinute(
          value.getHours() >= max.getHours() ? max.getMinutes() : undefined
        );
      }
    }
  }, [props.value]);

  const handleChange = useCallback(
    (_num: number, type: "hour" | "minute") => {
      if (!dateRef.current) return;
      const _date = dateRef.current;
      switch (type) {
        case "minute":
          _date.setMinutes(_num);
          break;
        case "hour":
          _date.setHours(_num);
          break;
        default:
          return;
      }

      props.onChange(_date);
    },
    [props.onChange, props.value]
  );

  return (
    <div className={style["time"]}>
      <div className={style["hour"]}>
        <div className={style["title"]}>時</div>
        <div className={style["content"]}>
          <SelectPage
            value={props.value.getHours()}
            minDisable={minHour}
            maxDisable={maxHour}
            minValue={0}
            maxValue={23}
            onClick={(_num: number) => handleChange(_num, "hour")}
          />
        </div>
      </div>
      <div className={style["minute"]}>
        <div className={style["title"]}>分</div>
        <div className={style["content"]}>
          <SelectPage
            value={props.value.getMinutes()}
            minDisable={minMinute}
            maxDisable={maxMinute}
            minValue={0}
            maxValue={59}
            onClick={(_num: number) => handleChange(_num, "minute")}
          />
        </div>
      </div>
    </div>
  );
}

function TimePicker(props: {
  type: "date" | "time";
  name?: string;
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  readonly?: boolean;
  onChange?: (_date: Date) => void;
}) {
  const today = new Date();
  const [timeStr, setTimeStr] = useState("");
  const [placeholderStr, setPlaceholderStr] = useState("");
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    switch (props.type) {
      case "date":
        setPlaceholderStr("請輸入日期。");
        break;
      case "time":
        setPlaceholderStr("請輸入時間。");
        break;
      default:
        return;
    }
  }, []);
  useEffect(() => {
    const value = props.value;
    if (value === undefined) return;

    let tempStr = "";
    switch (props.type) {
      case "date":
        tempStr = value.toLocaleDateString();
        setPlaceholderStr("請輸入日期。");
        break;
      case "time":
        tempStr = formatISOTimeString(value);
        setPlaceholderStr("請輸入時間。");
        break;
      default:
        return;
    }
    setTimeStr(tempStr);
  }, [props.value]);

  const handleChangeStringToDate = (_str: string) => {
    if (_str.replace(htmlReg, "").trim() === "") return;

    const tempArr = _str
      .split(/[\.\s\:\/]+/)
      .filter((item) => /^[0-9]+$/.test(item))
      .map((item) => parseInt(item));
    const timeCopy = props.value ? new Date(props.value) : new Date();

    if (tempArr.length === 0) return;

    switch (props.type) {
      case "date":
        if (tempArr[0].toString().length < 4)
          tempArr.unshift(timeCopy.getFullYear());
        if (tempArr[1] === undefined || tempArr[1] > 11)
          tempArr[1] = timeCopy.getMonth();
        else tempArr[1] -= 1;
        if (tempArr[2] === undefined || tempArr[2] > 60)
          tempArr[2] = timeCopy.getDate();

        timeCopy.setFullYear(tempArr[0], tempArr[1], tempArr[2]);
        break;
      case "time":
        if (tempArr[0] > 24) tempArr[0] = timeCopy.getHours();
        if (tempArr[1] === undefined) tempArr[1] = timeCopy.getMinutes();

        timeCopy.setHours(tempArr[0], tempArr[1]);
        break;
      default:
        return;
    }

    if (props.minDate && timeCopy < props.minDate)
      return handleTimePick(props.minDate);
    if (props.maxDate && timeCopy > props.maxDate)
      return handleTimePick(props.maxDate);

    handleTimePick(timeCopy);
  };

  const handleTimePick = useCallback((_time: Date) => {
    if (!props.onChange) return;

    props.onChange(_time);
  }, []);

  return (
    <div className={style["container"]}>
      <div className={style["input-container"]}>
        <input
          type="text"
          name={props.name}
          value={timeStr}
          onChange={(e: ChangeEvent) => setTimeStr(e.target.value)}
          onBlur={() => handleChangeStringToDate(timeStr)}
          onKeyUp={(e: KeyInputEvent) => {
            if (e.key === "Enter") {
              handleChangeStringToDate(timeStr);
            }
          }}
          className={style["user-input"]}
          placeholder={placeholderStr}
          readOnly={props.readonly}
        />
        {!props.readonly && (
          <button
            type="button"
            className={style["switch"]}
            onClick={async () => await setTimeout(() => setOpenPicker(true), 0)}
          >
            <Arrow />
          </button>
        )}
      </div>

      {openPicker && (
        <DropDown closeFnc={() => setOpenPicker(false)} up>
          {props.type === "date" ? (
            <DateSeleter
              value={props.value ? props.value : today}
              minDate={props.minDate}
              maxDate={props.maxDate}
              onChange={handleTimePick}
              closeFnc={() => setOpenPicker(false)}
            />
          ) : props.type === "time" ? (
            <TimeSelecter
              value={props.value ? props.value : today}
              minDate={props.minDate}
              maxDate={props.maxDate}
              onChange={handleTimePick}
              closeFnc={() => setOpenPicker(false)}
            />
          ) : (
            <></>
          )}
        </DropDown>
      )}
    </div>
  );
}

export default memo(TimePicker);
