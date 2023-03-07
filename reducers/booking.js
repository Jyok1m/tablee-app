import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  value: {bookingId: null}
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
    }
  }
});

export const {setBookingId, clearBookingId} = bookingSlice.actions;
export default bookingSlice.reducer;
