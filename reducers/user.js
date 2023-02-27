import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { username: null, token: null },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinUser: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
    },
    signupUser: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
    },
  },
});

export const { signinUser } = userSlice.actions;
export default userSlice.reducer;
