import { configureStore } from '@reduxjs/toolkit'
import loadingGlobalReducer from './loading'
import toastReducer from './toast'
import userReducer from './user'
import locationReducer from './location'

export default configureStore({
    reducer: {
        loadingGlobal: loadingGlobalReducer,
        toast: toastReducer,
        user: userReducer,
        location: locationReducer
    }
})