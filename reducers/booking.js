import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  value: {bookingId: null, refresher: 0}
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
      state.value.refresher += 1;
    }
  }
});

export const {setBookingId, refreshComponents} = bookingSlice.actions;
export default bookingSlice.reducer;
