import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    userData: {},
    unViewedPrescriptionsCount: 0,
    unViewedOrdersCount: 0,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setPrescriptionsCount: (state, action) => {
      state.unViewedCount = action.payload
    },
    setOrdersCount: (state, action) => {
      state.unViewedOrdersCount = action.payload
    }
  },

})

export const { setUserData, setPrescriptionsCount, setOrdersCount } = appUsersSlice.actions


export default appUsersSlice.reducer
