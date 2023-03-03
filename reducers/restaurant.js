import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null },
};

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    sendToken: (state, action) => {
      state.value.token = action.payload;
    },
  },
});

export const { addRestaurant, sendToken } = restaurantSlice.actions;
export default restaurantSlice.reducer;
