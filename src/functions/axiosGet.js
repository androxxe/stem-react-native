import { useToastErrorDispatch, useToastSuccessDispatch } from '../hooks';
import axios from 'axios';
import { variable } from '../utils';
import { setLoadingGlobal } from '../redux';

const axiosGet = async ({dispatch, route, config, isToast = true}) => {
    const errorDispatcher = useToastErrorDispatch();
    const successDispatcher = useToastSuccessDispatch();
    const source = axios.CancelToken.source();

    try {
        let response = await axios.get(`${variable.baseApi}${route}`, {
            ...config,
            cancelToken: source.token,
        });
        response = response.data;
        if(response.status == 1){
            if(isToast){
                successDispatcher(dispatch, response.message)
            }
            return {
                status: response.status,
                data: response.data,
                message: response.message,
                source
            };
        } else {
            if(isToast){
                errorDispatcher(dispatch, response.message);
            }
            return {
                status: response.status,
                data: response.data,
                message: response.message,
                source
            };
        }
    } catch(err){
        if(err.response?.data){
            return {
                status: err.response.data.status,
                data: err.response.data.data,
                message: err.response.data.message
            }
        }

        if(isToast){
            if(err.response?.data){
                errorDispatcher(dispatch, err.response.data.message);
            } else {
                errorDispatcher(dispatch, JSON.stringify(err));
            }
        }
        dispatch(setLoadingGlobal(false))
        console.log(err);
    }
}

export default axiosGet;