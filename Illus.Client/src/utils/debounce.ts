import { useRef } from "react";

function debounce(fn: (...args: any[]) => any, delay = 500) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
function asyncDebounce(fn: (...args: any[]) => any, delay = 500) {
  const tempRef = useRef<(...args: any[]) => void>();
  if (!tempRef.current) {
    tempRef.current = debounce(fn, delay);
  }
  return tempRef.current;
}

export { debounce, asyncDebounce };
