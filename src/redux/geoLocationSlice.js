import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  geoLocationData: {
    data: [],
    loading: false,
  },
};

const geoLocationSlice = createSlice({
  name: "geoLocationSlice",
  initialState,
  reducers: {
    setGeoLocationData: (state, action) => {
      state.geoLocationData = JSON.parse(
        JSON.stringify({
          ...state.geoLocationData,
          ...action.payload,
        })
      );
    },
  },
});

export const { setGeoLocationData } = geoLocationSlice.actions;

export default geoLocationSlice.reducer;
