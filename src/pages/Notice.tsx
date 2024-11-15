
import { ContentBox } from '../component/common/ContentBox/ContentBox';
import { NoticeMain } from '../component/page/Notice/NoticeMain/NoticeMain';
import { NoticeSearch } from '../component/page/Notice/NoticeSearch/NoticeSearch';
import { createContext, FC, useState } from 'react';




interface Context {
    searchKeyWord: object;
    setSearchKeyWord: (keyword: object) => void;
}

const defaultValue : Context = {
    searchKeyWord: {},
    setSearchKeyWord: () => {},

};
export const NoticeContext = createContext(defaultValue);

export const NoticeProvider: FC<{ children: React.ReactNode | React.ReactNode[]}> = ({children}) => {
    const [searchKeyWord, setSearchKeyWord] = useState({});
    return <NoticeContext.Provider value = {{ searchKeyWord, setSearchKeyWord}}>{children}</NoticeContext.Provider>
};

export const Notice = () => {

    //const [modal, setModal] = useState(false)
    return (
        <>
        <NoticeProvider>
            <ContentBox>공지사항</ContentBox>
            <NoticeSearch />
            <NoticeMain />
        </NoticeProvider>
        </>
    );
};
