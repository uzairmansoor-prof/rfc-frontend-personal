import { useEffect, useState } from "react";
import { SessionStorage, sessionType } from "@/core/utils/sessionStorage";

const loadInitialValue = (key, initialValue) => {
  try {
    return SessionStorage.getKey(key) ?? initialValue;
  } catch (e) {
    return initialValue;
  }
};

export function UseLocalStorage<T>(key: sessionType, initialValue: T) {
  const [value, setValue] = useState<T>(() =>
    loadInitialValue(key, initialValue),
  );

  useEffect(() => {
    SessionStorage.setKey(key, value ?? initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}

export default UseLocalStorage;
