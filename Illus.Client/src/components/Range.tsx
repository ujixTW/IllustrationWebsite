import { useEffect, useRef, useState } from "react";
import style from "../assets/CSS/components/Range.module.css";
import { ChangeEvent } from "../utils/tsTypesHelper";

type colorType = "default";

function DefaultRange(props: {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  name?: string;
  color?: colorType;
  onChange?: (e: ChangeEvent) => void;
}) {
  const { min, max, step, value, name, color, onChange } = props;
  const [type, setType] = useState(style["default"]);
  const [sliderColor, setSliderColor] = useState("");
  const [valueColor, setValueColor] = useState("");
  const [progress, setProgess] = useState(0);
  const rangeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    const mainBlue = computedStyle.getPropertyValue("--mainBlue");
    setSliderColor(computedStyle.getPropertyValue("--fontC"));

    switch (color) {
      case "default":
        setType(style["default"]);
        setValueColor(mainBlue);
        break;

      default:
        setType(style["default"]);
        setValueColor(mainBlue);
        break;
    }
  }, []);

  useEffect(() => {
    if (value && rangeRef.current)
      setProgess(((value - 1) / (parseFloat(rangeRef.current.max) - 1)) * 100);
  }, [value]);

  return (
    <input
      type="range"
      ref={rangeRef}
      className={style["range"] + " " + type}
      min={min}
      max={max}
      step={step}
      value={value}
      name={name}
      onChange={onChange}
      style={{
        backgroundImage: `linear-gradient(to right, ${valueColor} ${progress}%, ${sliderColor} ${progress}%)`,
      }}
    />
  );
}
export default DefaultRange;
