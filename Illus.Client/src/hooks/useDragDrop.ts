import { useCallback, useEffect, useRef, useState } from "react";

const stopEventDefault = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
const checkIsDragIn = (e: DragEvent) =>
  e.dataTransfer && e.dataTransfer.items.length > 0;

function useDragDrop(onUploadFiles?: (files: FileList) => void) {
  const dropElRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDrag] = useState(false);

  const handleDragIn = useCallback((e: DragEvent) => {
    stopEventDefault(e);
    const isDragIn = checkIsDragIn(e);
    dragCounter.current++;
    if (isDragIn) setIsDrag(true);
  }, []);
  const handleDragOut = useCallback((e: DragEvent) => {
    stopEventDefault(e);
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDrag(false);
  }, []);
  const handleDrag = useCallback((e: DragEvent) => {
    stopEventDefault(e);
  }, []);
  const handleDrop = useCallback(
    (e: DragEvent) => {
      stopEventDefault(e);
      setIsDrag(false);
      const isDragIn = checkIsDragIn(e);
      if (isDragIn && e.dataTransfer) {
        onUploadFiles && onUploadFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
        dragCounter.current = 0;
      }
    },
    [onUploadFiles]
  );

  useEffect(() => {
    if (dropElRef.current) {
      const el = dropElRef.current;
      el.addEventListener("dragenter", handleDragIn);
      el.addEventListener("dragleave", handleDragOut);
      el.addEventListener("dragover", handleDrag);
      el.addEventListener("drop", handleDrop);
      return () => {
        el.removeEventListener("dragenter", handleDragIn);
        el.removeEventListener("dragleave", handleDragOut);
        el.removeEventListener("dragover", handleDrag);
        el.removeEventListener("drop", handleDrop);
      };
    }
  }, [handleDrag, handleDragIn, handleDragOut, handleDrop]);

  return {
    dropElRef,
    isDragging,
  };
}

export default useDragDrop;
