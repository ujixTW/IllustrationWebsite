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
  const timerRef = useRef<number>();
  return (...args: any) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(async () => {
      await fn(...args);
    }, delay);
  };
}

export { debounce, asyncDebounce };
