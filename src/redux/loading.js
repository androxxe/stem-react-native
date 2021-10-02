import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
    name: 'loadingGlobal',
    initialState: {
        loading: false,
    },
    reducers: {
        setLoadingGlobal: (state, action) => {
            if(action.payload == true){
              state.loading = true;
            } else {
              state.loading = false;
            }
        }
    },

})

export const { setLoadingGlobal } = loadingSlice.actions

export default loadingSlice.reducer