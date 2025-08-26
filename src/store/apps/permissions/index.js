// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Invoices
export const fetchData = createAsyncThunk('appPermissions/fetchData', async params => {
  const response = await axios.get('/apps/permissions/data', {
    params
  })

  return response.data
})

export const appPermissionsSlice = createSlice({
  name: 'appPermissions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    userPermissions: []
  },
  reducers: {
    updatePermissions: (state, action) => {
      state.userPermissions = action.payload
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.permissions
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export const { updatePermissions } = appPermissionsSlice.actions

export default appPermissionsSlice.reducer
