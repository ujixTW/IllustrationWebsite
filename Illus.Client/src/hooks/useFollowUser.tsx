import { useCallback, useMemo, useState } from "react";
import { ConsistentBtn, SureBtn } from "../components/Button/BasicButton";
import axios from "axios";
import { useAppSelector } from "./redux";

function useFollowUser(artistId: number) {
  const userId = useAppSelector((state) => state.userData.id);
  const [isFollow, setIsFollow] = useState(false);

  const handleFollow = useCallback(
    async (value: boolean) => {
      if (userId === artistId) return;

      await axios.post(`/api/User/Follow/${artistId}`).then(() => {
        setIsFollow(value);
      });
    },
    [artistId, userId]
  );

  const followBtn = useMemo(
    () =>
      isFollow ? (
        <ConsistentBtn text="關注中" onClick={() => handleFollow(false)} />
      ) : (
        <SureBtn text="關注" onClick={() => handleFollow(true)} />
      ),
    [isFollow]
  );

  return {
    followBtn,
    isFollow,
    setIsFollow,
  };
}
export default useFollowUser;
