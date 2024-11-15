import { useEffect, useRef } from "react";

export const useOnMount = (callback: () => void) => {
  let mount = useRef(true);

  useEffect(() => {
    if (mount.current) {
      callback();
      mount.current = false;
    }
  }, []);
};
