import { NoticeModalStyled } from './styled';
import {FC} from 'react';
export const NoticeModal: FC<{ modal:boolean; setModal: (modal: boolean) => void}> = ({modal, setModal}) => {
    const handlerModal = () => {
        setModal(!modal);
    };
    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text"></input>
                </label>
                <label>
                    내용 : <input type="text"></input>
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
                    <button>저장</button>
                    <button>삭제</button>
                    <button onClick={handlerModal}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};
