import { setToast } from '../redux'

export const useToastErrorDispatch = () => {
    return (dispatch, pesan) => {
        dispatch(setToast({
            text: pesan,
            textAksi: 'Tutup',
            show: true,
            type: 'error',
            aksi: {
                type: 'close'
            }
        }));
    }
}

export const useToastSuccessDispatch = () => {
    return (dispatch, pesan) => {
        dispatch(setToast({
            text: pesan,
            textAksi: 'Tutup',
            type: 'success',
            show: true,
            aksi: {
                type: 'close'
            }
        }));
    }
}

export const useToastWarningDispatch = () => {
    return (dispatch, pesan) => {
        dispatch(setToast({
            text: pesan,
            textAksi: 'Tutup',
            type: 'warning',
            show: true,
            aksi: {
                type: 'close'
            }
        }));
    }
}
