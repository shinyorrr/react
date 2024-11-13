import { useLocation } from 'react-router-dom';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NoticeModal } from '../NoticeModal/NoticeModal';
import { Portal } from '../../../common/potal/Portal';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';


interface INotice {// interface 네이밍 할때 앞에 I붙이면 좋다
            noticeIdx:number;
            title:string;
            author:string;
            createdDate:string;
        

}
export const NoticeMain = () => {
    const {search} = useLocation();
    const [noticeList, setNoticeList] = useState<INotice[]>();
    const [listCount, setListCount]  = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState); //recoil에 저장된 state
    //const [modal2, setModal2] = useState<boolean>(false); // 컴포넌트에서 만든 state

    useEffect(() => {
        searchNoticeList();
    },[search]);

    const searchNoticeList = (currentPage?: number) => { // 안에 파라미터를 줌으로써
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append('currentPage',currentPage.toString());
        searchParam.append('pageSize','5');

        axios.post('/board/noticeListJson.do',searchParam).then((res) => {
            setNoticeList(res.data.notice);
            setListCount(res.data.noticeCnt);
        });
    };

    const handlerModal = () => {
        setModal(!modal);
    }

    // const handlerModal = () => {
    //     setModal2(!modal);
    // }
    return (
        <>
            총 갯수 : {listCount} 현재 페이지 : 0
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
                    {noticeList?.length > 0 ? ( //noticeList의 값이 있는지 없는지
                        noticeList?.map((notice) => {
                            return (
                                // <tr key ={notice.noticeIdx} onClick={handlerModal}></tr>
                                <tr key ={notice.noticeIdx} onClick={handlerModal}>
                                    <StyledTd>{notice.noticeIdx}</StyledTd>
                                    <StyledTd>{notice.title}</StyledTd>
                                    <StyledTd>{notice.author}</StyledTd>
                                    <StyledTd>{notice.createdDate}</StyledTd>
                                </tr>                           
                            );
                        })
                    ) : (
                    <tr>
                        <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
                    </tr>
                    )}
                    </tbody>
            </StyledTable>
            {modal && (
                 <Portal>
                   <NoticeModal/>
                 </Portal>
            )}


        </>
    );
};