import { createSlice } from '@reduxjs/toolkit'

export const locationSlice = createSlice({
    name: 'location',
    initialState: {
        location: {},
        statusPermission: false,
        isGpsOn: false,
        isLoadingLocation: false,
        isModalEnableGPS: false,
        isDenied: false,
    },
    reducers: {
        setLocation: (state, action) => {
            state.location = action.payload;
        },
        setStatusPermission: (state, action) => {
            state.statusPermission = action.payload;
        },
        setIsLoadingLocation: (state, action) => {
            state.isLoadingLocation = action.payload;
        },
        setIsGpsOn: (state, action) => {
            state.isGpsOn = action.payload;
        },
        setIsModalEnableGPS: (state, action) => {
            state.isModalEnableGPS = action.payload
        },
        setIsDenied: (state, action) => {
            state.isDenied = action.payload
        }
    },

})

export const { setLocation, setIsDenied, setStatusPermission, setIsLoadingLocation, setIsGpsOn, setIsModalEnableGPS } = locationSlice.actions

export default locationSlice.reducer