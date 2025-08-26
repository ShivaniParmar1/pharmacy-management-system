// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const registrationSlice = createSlice({
  name: 'registrationData',
  initialState: {
    registrationData: {},
    userData: {}
  },
  reducers: {
    setRegistrationData: (state, action) => {
      state.registrationData = action.payload
    },
    resetRegistrationData: state => {
      state.registrationData = {} // Reset registration data to initial state
    }
  }
})

export const { setRegistrationData, resetRegistrationData } = registrationSlice.actions

export default registrationSlice.reducer
