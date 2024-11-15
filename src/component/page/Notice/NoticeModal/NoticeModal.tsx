import { useRecoilState } from 'recoil';
import { NoticeModalStyled } from './styled';
import { modalState } from '../../../../stores/modalState';
import context from 'react-bootstrap/esm/AccordionContext';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
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
    const [noticeDetail, setNoticeDetail] = useState<INoticeDatail>();
    // const [seq, setSeq] = useState<number>(noticeSeq); //리드온리
    const title = useRef<HTMLInputElement>();
    const context = useRef<HTMLInputElement>();
    const [imageUrl, setImageUrl] = useState<string>();
    const[fileData, setFileData] = useState<File>();
    

    //상세조회
    const searchDetail = async () => {
        const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail, {noticeSeq});

        if (detail){
            setNoticeDetail(detail.detail);
            const {fileExt , logicalPath} = detail.detail; //자동완성 되는 이유 : typeScrip 기능 
            
            if(fileExt === 'jpg' || fileExt ==='gif' || fileExt ==='png'){
                       setImageUrl(logicalPath);
                    } else{
                        setImageUrl("");
                    }


            console.log(detail)
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



    
    const handlerSave = async() => {
        const param = {
            title: title.current.value,
            context: context.current.value,
            loginId: userInfo.loginId,
        };
        const save = await postNoticeApi<IPostResponse>(Notice.getSave, param);

        if (save.result === 'success') {
            onSuccess();
        }

        // if (detail){
        //     setNoticeDetail(detail.detail);
        //     console.log(detail)
        // }

        // axios.post('/board/noticeSaveBody.do', param).then((res: AxiosResponse<IPostResponse>) => {
        //     res.data.result === 'success' && onSuccess();
        // });
        
    };


    const handlerFileSave = () => {
        const fileForm = new FormData();
        const textData = {
          title: title.current.value,
          context: context.current.value,
          loginId: userInfo.loginId,
        };
        fileData && fileForm.append("file", fileData);
        fileForm.append(
          "text",
          new Blob([JSON.stringify(textData)], { type: "application/json" })
          //new Blob 바이너리데이터로 보내주는 것
        );
        axios
          .post("/board/noticeSaveFileForm.do", fileForm)
          .then((res: AxiosResponse<IPostResponse>) => {
            res.data.result === "success" && onSuccess();
          });
      };

    //   const handlerUpdate = async () => {
    //     const param = {
    //       title: title.current.value,
    //       context: context.current.value,
    //       noticeSeq,
    //     };
    
    //     const update = await postNoticeApi<IPostResponse>(Notice.getUpdate, param);
    
    //     if (update?.result === "success") {
    //       onSuccess();
    //     }
    
        //axios
        //  .post("/board/noticeUpdateBody.do", param)
        //  .then((res: AxiosResponse<IPostResponse>) => {
        //    res.data.result === "success" && onSuccess();
        //  });
    //   };

    const handlerFileUpdate = () => {
        const fileForm = new FormData();
        const textData = {
          title: title.current.value,
          context: context.current.value,
          loginId: userInfo.loginId,
        };
        fileData && fileForm.append("file", fileData);
        fileForm.append(
          "text",
          new Blob([JSON.stringify(textData)], { type: "application/json" })
          //new Blob 바이너리데이터로 보내주는 것
        );
        axios
          .post("/board/noticeUpdateFileForm.do", fileForm)
          .then((res: AxiosResponse<IPostResponse>) => {
            res.data.result === "success" && onSuccess();
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

    // 타입을 object라고 하면 너무광범위하니까 받아옴 
    //filePreview() 를 리액트(js)로 컨버징 할 것.
    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        //console.log(e);
        const fileInfo = e.target.files; //onChane 했을 때 배열 형태로 파일 조회
        if(fileInfo?.length > 0) {
            const fileInfoSplit = fileInfo[0].name.split('.');
            const fileExtension = fileInfoSplit[1].toLowerCase();

            if(fileExtension === 'jpg' || fileExtension ==='gif' || fileExtension ==='png'){
               setImageUrl(URL.createObjectURL(fileInfo[0]));
            } else{
                setImageUrl("");
            }
            setFileData(fileInfo[0]);
        }
    };

    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" ref = {title} defaultValue={noticeDetail?.title}></input>
                </label>
                <label>
                    내용 : <input type="text" ref = {context} defaultValue={noticeDetail?.content}></input>
                </label>
                파일 :<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handlerFile}></input>
                <label className="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div>
                    {imageUrl ? (
                    <div>
                        <label>미리보기</label>
                        <img src={imageUrl} />
                        {fileData?.name}
                    </div>
                    ) : (
                        <div>{fileData?.name}</div>

                    )}
                </div>
                <div className={'button-container'}>
                    <button onClick = {noticeSeq? handlerFileUpdate : handlerFileSave}>{noticeSeq ? '수정' : '등록'}</button>
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

