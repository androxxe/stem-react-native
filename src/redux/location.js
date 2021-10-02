import { createSlice } from '@reduxjs/toolkit'

export const locationSlice = createSlice({
    name: 'location',
    initialState: {
        location: {},
        status: false
    },
    reducers: {
        setLocation: (state, action) => {
            state.location = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
    },

})

export const { setLocation, setStatus } = locationSlice.actions

export default locationSlice.reducer