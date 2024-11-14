import { useRecoilState } from 'recoil';
import { NoticeModalStyled } from './styled';
import { modalState } from '../../../../stores/modalState';
import context from 'react-bootstrap/esm/AccordionContext';
import { FC, useEffect, useRef, useState } from 'react';
import { loginInfoState } from '../../../../stores/userInfo';
import { ILoginInfo } from '../../../../models/interface/store/userInfo';
import axios, { AxiosResponse } from 'axios';


import { IDetailResponse, INoticeDatail, IPostResponse } from '../../../../models/interface/INotice';
import { Notice } from '../../../../api/api';
import { postNoticeApi } from '../../../../api/postNoticeApi';


// interface IPostResponse{
//     result: string;
// }



// interface INoticeDatail extends INotice{
//     content: string;
//     fileExt: string | null;
//     fileName: string | null;
//     fileSize: number;
//     logicalpath: string | null;
//     phsycalPath: string | null;
// }

// interface IDetailResponse{
//     detail: INoticeDatail;

// }

interface INoticeModalProps{
    onSuccess: () => void;
    noticeSeq: number;
    setNoticeSeq: (noticeSeq: number | undefined) => void;
}

export const NoticeModal: FC<INoticeModalProps> = ({ onSuccess, noticeSeq, setNoticeSeq } ) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const [noticeDetail, setNoticeDeatail] = useState<INoticeDatail>();
    // const [seq, setSeq] = useState<number>(noticeSeq); //리드온리
    const title = useRef<HTMLInputElement>();
    const context = useRef<HTMLInputElement>();
    

    //상세조회
    const searchDetail = async () => {
        const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail, {noticeSeq});

        if (detail){
            setNoticeDeatail(detail.detail);
        }
    
        // axios.post('/board/noticeDetailBody.do', {noticeSeq}).then((res: AxiosResponse) => {
        //     setNoticeDeatail(res.data.detail);
        // });
    };

    useEffect(() => { 
        noticeSeq && searchDetail(); //컴포넌트가 생성

        return () => {//컴포넌트 언마운트 되기(사리지기) 직전의 콜백 함수 
           noticeSeq && setNoticeSeq(undefined);

        }; 
    }, []);


    

    const handlerModal = () => {
        setModal(!modal);
    };

    const handlerSave = () => {
        const param = {
            title: title.current.value,
            context: context.current.value,
            loginId: userInfo.loginId,
        };
        axios.post('/board/noticeSaveBody.do', param).then((res: AxiosResponse<IPostResponse>) => {
            res.data.result === 'success' && onSuccess();
        });
        
    };

    const handlerUpdate = () => {
        const param = {
            title: title.current.value,
            context: context.current.value,
            noticeSeq,
        };
        axios.post('/board/noticeUpdateBody.do', param).then((res: AxiosResponse<IPostResponse>) => {
            res.data.result === 'success' && onSuccess();
        });
    }

    const handlerDelete = () => {
        const param = {
            title: title.current.value,
            context: context.current.value,
            noticeSeq,
        };
        axios.post('/board/noticeDeleteBody.do',param).then((res: AxiosResponse<IPostResponse>) => {
            res.data.result === 'success' && onSuccess();

    });
    }



    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" ref = {title} defaultValue={noticeDetail?.title}></input>
                </label>
                <label>
                    내용 : <input type="text" ref = {context} defaultValue={noticeDetail?.content}></input>
                </label>
                파일 :<input type="file" id="fileInput" style={{ display: 'none' }}></input>
                <label className="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div>
                    <div>
                        <label>미리보기</label>
                        <img src="" />
                    </div>
                </div>
                <div className={'button-container'}>
                    <button onClick = {noticeSeq? handlerUpdate : handlerSave}>{noticeSeq ? '수정' : '등록'}</button>
                    <button onClick = {handlerDelete}>삭제</button>
                    <button onClick = {handlerModal}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};
function res(value: AxiosResponse<any, any>): AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>> {
    throw new Error('Function not implemented.');
}

