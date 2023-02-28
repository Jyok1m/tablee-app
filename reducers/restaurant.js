import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    addRestaurant: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { addRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
