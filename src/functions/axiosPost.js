import axios from 'axios';
import { useToastSuccessDispatch, useToastErrorDispatch } from '../hooks'
import { setLoadingGlobal } from '../redux';
import { variable } from '../utils'

const axiosPost = async ({dispatch, route, data, headers, isToast = true}) => {
    const errorDispatcher = useToastErrorDispatch();
    const successDispatcher = useToastSuccessDispatch();
    try {
        let response = await axios.post(`${variable.baseApi}${route}`, data, { headers: headers});
        response = response.data;        
        if(response.status == 1){
            if(isToast){
                successDispatcher(dispatch, response.message)
            }
            return {
                status: response.status,
                data: response.data,
                message: response.message
            };
        } else {
            if(isToast){
                errorDispatcher(dispatch, response.message);
            }
            return {
                status: response.status,
                data: response.data,
                message: response.message
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
                errorDispatcher(dispatch, 'Gagal memuat data');
            }
        }
        dispatch(setLoadingGlobal(false))
    }
}

export default axiosPost;