import { FC, useState, createContext } from "react";

interface Context {
  searchKeyword: object;
  setSearchKeyword: (keyword: object) => void;
}

const defaultValue: Context = {
  searchKeyword: {},
  setSearchKeyword: () => {},
};

export const NoticeContext = createContext(defaultValue);

export const NoticeProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState({});
  return <NoticeContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</NoticeContext.Provider>;
};