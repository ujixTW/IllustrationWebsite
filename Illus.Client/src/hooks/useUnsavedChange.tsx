import { useCallback, useEffect, useMemo, useState } from "react";
import { useBlocker } from "react-router-dom";
import UnsavedChangeModal from "../components/modals/UnsavedChangeModal";

function useUnSavedChange() {
  const [isDirty, setIsDirty] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [confirm, setConfirm] = useState<any>(() => () => undefined);
  const bloker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (!isDirty) window.onbeforeunload = null;
  }, [isDirty]);

  const checkUnsaved = useCallback(
    (_confirm: (...args: any[]) => void) => {
      if (isDirty) {
        setShowWin(true);
        setConfirm(() => _confirm);
        return;
      }
      _confirm();
    },
    [isDirty]
  );

  const CheckUnsavedModal = useMemo(() => {
    return showWin ? (
      <UnsavedChangeModal
        onCancel={() => setShowWin(false)}
        onConfirm={() => {
          confirm();
          setShowWin(false);
          setIsDirty(false);
        }}
      />
    ) : null;
  }, [confirm, showWin]);

  const CheckUnsavedToLeaveModal = useMemo(() => {
    return bloker.state === "blocked" ? (
      <UnsavedChangeModal
        onCancel={() => {
          bloker.reset();
        }}
        onConfirm={() => {
          setIsDirty(false);
          bloker.proceed();
        }}
      />
    ) : null;
  }, [bloker]);

  return {
    setIsDirty: (_isDirty: boolean) => {
      if (_isDirty) {
        window.onbeforeunload = (e: BeforeUnloadEvent) => {
          e.preventDefault();
          e.returnValue = true;
        };
      } else {
        window.onbeforeunload = null;
      }
      setIsDirty(_isDirty);
    },
    isDirty,
    checkUnsaved,
    CheckUnsavedModal,
    CheckUnsavedToLeaveModal,
  };
}
export default useUnSavedChange;
