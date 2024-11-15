import { createContext, useContext, useState } from "react";

const stateContext = createContext({
  formValue: undefined,
  setFormValue: undefined,
});

const StateContextProvider = ({ children }) => {
  const [formValue, setFormValue] = useState(undefined);

  return (
    <stateContext.Provider
      value={{
        formValue,
        setFormValue,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

const useStateContext = () => {
  const stateContextValue = useContext(stateContext);
  if (!stateContextValue) {
    throw new Error("useContext must be used within a StateContextProvider");
  }
  return stateContextValue;
};

export { useStateContext, StateContextProvider };
