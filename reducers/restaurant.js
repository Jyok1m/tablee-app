import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    addRestaurant: (state, action) => {
      state.value = action.payload;
      state.value.token = action.payload.token;
    },
  },
});

export const { addRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
