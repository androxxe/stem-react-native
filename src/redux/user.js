import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        token: null,
        isLogin: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setIsLogin: (state, action) => {
            state.isLogin = action.payload
        }
    },

})

export const { setUser, setToken, setIsLogin } = userSlice.actions

export default userSlice.reducer