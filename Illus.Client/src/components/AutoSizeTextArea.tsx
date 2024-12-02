import { useEffect, useRef } from "react";
import style from "../assets/CSS/components/TextArea.module.css";
import { debounce } from "../utils/debounce";

function AutoSizeTextArea(props: {
  value: string;
  onChange: (...args: any[]) => any;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    handleReSize();
  }, []);

  const handleReSize = debounce(() => {
    if (textareaRef.current) {
      const target = textareaRef.current;
      target.style.height = "auto";      
      target.style.height = `${target.scrollHeight}px`;
    }
  });
  return (
    <textarea
      ref={textareaRef}
      name="text"
      className={style["auto-size"]}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      onKeyDown={handleReSize}
      rows={1}
    />
  );
}

export default AutoSizeTextArea;
