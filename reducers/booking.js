import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  value: {bookingId: null, refresher: false}
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingId: (state, action) => {
      state.value.bookingId = action.payload;
    },
    clearBookingId: (state, action) => {
      state.value.bookingId = null;
    },
    refreshComponents: (state, action) => {
      state.value.refresher = !state.value.refresher;
    }
  }
});

export const {setBookingId, clearBookingId, refreshComponents} = bookingSlice.actions;
export default bookingSlice.reducer;
