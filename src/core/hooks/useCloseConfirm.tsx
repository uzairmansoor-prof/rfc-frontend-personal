import { useEffect, useRef, useState } from "react";
import { debounce } from "../utils/functions";

const UseCloseConfirm = () => {
  const [showPopAlert, setShowPopAlert] = useState(false);
  const [autostatecheck, setautostatecheck] = useState(true);
  const isScrolling = useRef<number | null>(null);
  const isScrollStarted = useRef(false);

  const onScroll = debounce(() => {
    if (!isScrollStarted.current) {
      isScrollStarted.current = true;
      setShowPopAlert(false);
      setautostatecheck(false);
    }

    if (isScrolling.current !== null) {
      clearTimeout(isScrolling.current);
    }

    isScrolling.current = window.setTimeout(() => {
      setautostatecheck(true);
      isScrollStarted.current = false;
    }, 0);
  }, 0);

  useEffect(() => {
    const scrollElement =
      document.querySelector(".promo-container") ||
      document.querySelector(".ant-table-body");
    scrollElement.addEventListener("scroll", onScroll);
    return () => {
      scrollElement.removeEventListener("scroll", onScroll);
    };
  }, []);
  return {
    autostatecheck,
    showPopAlert,
  };
};

export default UseCloseConfirm;
