import { useLocation, useNavigate } from "react-router-dom";
import {
  StyledTable,
  StyledTd,
  StyledTh,
} from "../../../common/styled/StyledTable";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import {
  INotice,
  INoticeListResponse,
} from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";

export const NoticeMain = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [noticeList, setNoticeList] = useState<INotice[]>();
  const [listCount, setListCount] = useState<number>(0);
  const [modal, setModal] = useRecoilState<boolean>(modalState); //recoil에 저장된 state
  const [index, setIndex] = useState<number>();
  const [cPage, setCPage] = useState<number>();
  const { searchKeyword } = useContext(NoticeContext);

  useEffect(() => {
    searchNoticeList();
  }, [search]);

  useEffect(() => {
    searchNoticeList();
  }, [searchKeyword]);

  const searchNoticeList = async (currentPage?: number) => {
    currentPage = currentPage || 1;
    // const searchParam = new URLSearchParams(search);
    // searchParam.append("currentPage", currentPage.toString());
    // searchParam.append("pageSize", "5");
    const searchParam = {
      ...searchKeyword,
      currentPage: currentPage.toString(),
      pageSize: "5",
    };

    const searchList = await postNoticeApi<INoticeListResponse>(
      Notice.getListBody,
      searchParam
    );

    if (searchList) {
      setNoticeList(searchList.notice);
      setListCount(searchList.noticeCnt);
      setCPage(currentPage);
    }
    //axios.post("/board/noticeListJson.do", searchParam).then((res) => {
    //  setNoticeList(res.data.notice);
    //  setListCount(res.data.noticeCnt);
    //});
  };

  const handlerModal = (index: number) => {
    setModal(!modal);
    setIndex(index);
  };

  const onPostSuccess = () => {
    setModal(!modal);
    searchNoticeList();
  };

  const handlerDynamicRouter = (noticeIdx: number) => {
    navigate(noticeIdx);
  }

  return (
    <>
      총 갯수 : {listCount} 현재 페이지 : {cPage}
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={50}>제목</StyledTh>
            <StyledTh size={10}>작성자</StyledTh>
            <StyledTh size={20}>등록일</StyledTh>
          </tr>
        </thead>
        <tbody>
          {noticeList?.length > 0 ? (
            noticeList?.map((notice) => {
              return (
                // <tr key={notice.noticeIdx} onClick={() => handlerModal(notice.noticeIdx)}>
                <tr key = {notice.noticeIdx} onClick={() =>{
                    navigate(notice.noticeIdx.toString(), {state: {title: notice.title}});
                    //navigate = url 이동시키는것. url 은 string 타입이라 인자도 string타입이어야함.
                }}>
                  <StyledTd>{notice.noticeIdx}</StyledTd>
                  <StyledTd>{notice.title}</StyledTd>
                  <StyledTd>{notice.author}</StyledTd>
                  <StyledTd>{notice.createdDate}</StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={4}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <PageNavigate
        totalItemsCount={listCount}
        onChange={searchNoticeList}
        activePage={cPage}
        itemsCountPerPage={5}
      ></PageNavigate>
      {modal && (
        <Portal>
          <NoticeModal
            onSuccess={onPostSuccess}
            noticeSeq={index}
            setNoticeSeq={setIndex}
          />
        </Portal>
      )}
    </>
  );
};


// import { useLocation } from 'react-router-dom';
// import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { NoticeModal } from '../NoticeModal/NoticeModal';
// import { Portal } from '../../../common/potal/Portal';
// import { useRecoilState } from 'recoil';
// import { modalState } from '../../../../stores/modalState';
// import { postNoticeApi } from '../../../../api/postNoticeApi';

// import { Notice } from '../../../../api/api';
// import { INotice, INoticeListResponse } from '../../../../models/interface/INotice';
// import { PageNavigate } from '../../../common/pageNavigation/PageNavigate';






// export const NoticeMain = () => {
//     const {search} = useLocation();
//     const [noticeList, setNoticeList] = useState<INotice[]>();
//     const [listCount, setListCount]  = useState<number>(0);
//     const [modal, setModal] = useRecoilState<boolean>(modalState); //recoil에 저장된 state
//     //const [modal2, setModal2] = useState<boolean>(false); // 컴포넌트에서 만든 state
//     const [index, setIndex] = useState<number>();
//     const [cPage, setCPage] = useState<number>();

//     useEffect(() => { searchNoticeList(); },[search]);

//     const searchNoticeList = async (currentPage?: number) => { // 안에 파라미터를 줌으로써
//         currentPage = currentPage || 1;
//         const searchParam = new URLSearchParams(search);
//         searchParam.append('currentPage',currentPage.toString());
//         searchParam.append('pageSize','5');

//         const searchList = await postNoticeApi<INoticeListResponse>(Notice.getList,searchParam);
//         if (searchList){
//             setNoticeList(searchList.notice);
//             setListCount(searchList.noticeCnt);
//             setCPage(currentPage);
//         }
//         // axios.post('/board/noticeListJson.do',searchParam).then((res) => {
//         //     setNoticeList(res.data.notice);
//         //     setListCount(res.data.noticeCnt);
//         // });
//     };

//     useEffect(() => {
//         searchNoticeList();
//         console.log(searchKeyword);
//       }, [searchKeyword]);
    
//       const searchNoticeList = async (currentPage?: number) => {
//         // 안에 파라미터를 줌으로써
//         currentPage = currentPage || 1;
    
//         const searchParam = { ...searchKeyword, currentPage: currentPage.toString(), pageSize: 5 };
    
//         const searchList = await postNoticeApi<INoticeListResponse>(Notice.getListBody, searchParam);
//         if (searchList) {
//           setNoticeList(searchList.notice);
//           setListCount(searchList.noticeCnt);
//           setCPage(currentPage);
//         }
//       };




//     const handlerModal = (index: number) => {
//         setModal(!modal);
//         setIndex(index);
//     }

//     const onPostSuccess = () => {
//         setModal(!modal); //modal 닫아줌
//         searchNoticeList(); // list 불러줌
//     }

//     // const handlerModal = () => {
//     //     setModal2(!modal);
//     // }
//     return (
//         <>
//             총 갯수 : {listCount} 현재 페이지 : {cPage}
//             <StyledTable>
//                 <thead>
//                     <tr>
//                         <StyledTh size={5}>번호</StyledTh>
//                         <StyledTh size={50}>제목</StyledTh>
//                         <StyledTh size={10}>작성자</StyledTh>
//                         <StyledTh size={20}>등록일</StyledTh>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {noticeList?.length > 0 ? ( //noticeList의 값이 있는지 없는지
//                         noticeList?.map((notice) => {
//                             return (
//                                 // <tr key ={notice.noticeIdx} onClick={handlerModal}></tr>
//                                 <tr key ={notice.noticeIdx} onClick={() => handlerModal(notice.noticeIdx)}>
//                                     <StyledTd>{notice.noticeIdx}</StyledTd>
//                                     <StyledTd>{notice.title}</StyledTd>
//                                     <StyledTd>{notice.author}</StyledTd>
//                                     <StyledTd>{notice.createdDate}</StyledTd>
//                                 </tr>                           
//                             );
//                         })
//                     ) : (
//                     <tr>
//                         <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
//                     </tr>
//                     )}
//                     </tbody>
//             </StyledTable>
//             <PageNavigate 
//                     totalItemsCount={listCount} 
//                     onChange={searchNoticeList} 
//                     activePage={cPage} 
//                     itemsCountPerPage={5} 
//             ></PageNavigate>

//             {modal && (
//                  <Portal>
//                    <NoticeModal onSuccess={onPostSuccess} noticeSeq={index} setNoticeSeq={setIndex}/>
//                  </Portal>
//             )}


//         </>
//     );
// };

// //export { INotice };
