// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";


export const profileSlice = createSlice({
  name: "users",
  initialState: {
    accessToken: "",
    number: "",
    full_name: ""
  },
  reducers: {
    updateAuth: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.number = action.payload.number;
      state.full_name = action.payload.full_name;
    },
  },
});

export const { updateAuth } = profileSlice.actions;

export default profileSlice.reducer;
