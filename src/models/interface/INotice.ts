
export interface INotice {  // interface 네이밍 할때 앞에 I붙이면 좋다

    noticeIdx:number;
    title:string;
    author:string;
    createdDate:string;

}

export interface INoticeDatail extends INotice{
    content: string;
    fileExt: string | null;
    fileName: string | null;
    fileSize: number;
    logicalPath: string | null;
    phsycalPath: string | null;
}

export interface IPostResponse{
    result: string;
}

export interface IDetailResponse{
    detail: INoticeDatail;

}

export interface INoticeListResponse{
    noticeCnt: number;
    notice: INotice[];
}
