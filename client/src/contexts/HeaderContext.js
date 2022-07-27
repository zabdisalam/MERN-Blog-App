import { createContext, useState } from "react";

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [headerTitle, setHeaderTitle] = useState();

  return (
    <HeaderContext.Provider
      value={{ headerTitle: headerTitle, setHeaderTitle }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
