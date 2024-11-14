import axios, { AxiosResponse } from "axios";

export const postNoticeApi = async <T> (api: string, param: object) => {
    try{
        const result: AxiosResponse<T> = await axios.post(api, param); //return이 프로미스인 프로미스 호출 함수
        return result.data;
    }catch(error){
        alert(error);

    }
};