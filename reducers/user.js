import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { username: null, token: null, photos: null, profilePic: false },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinUser: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
    },
    addPhoto: (state, action) => {
      state.value.photos = action.payload;
    },
    signupUser: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
    },
    removePhoto: (state, action) => {
      state.value.photos = "";
    },
    logoutUser: (state, action) => {
      state.value.username = null;
      state.value.token = null;
    },
    refreshProfilePic: (state, action) => {
      state.value.profilePic = !state.value.profilePic;
    },
    removeProfilePic: (state, action) => {
      state.value.photos = null;
    },
  },
});

export const {
  signinUser,
  addPhoto,
  signupUser,
  removePhoto,
  logoutUser,
  refreshProfilePic,
  removeProfilePic,
} = userSlice.actions;
export default userSlice.reducer;
