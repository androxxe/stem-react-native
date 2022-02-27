import { createSlice } from '@reduxjs/toolkit'

export const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toast: {
      text: '',
      textAksi: 'Tutup',
      show: true,
      aksi: {
        type: 'close'
      },
      type: null,
      time: 3000
    }
  },
  reducers: {
    setToast: (state, action) => {
      if(!action.payload.time){
        action.payload.time = 3000;
      }
      state.toast = action.payload;
    }
  }
})

export const { setToast } = toastSlice.actions

export default toastSlice.reducer