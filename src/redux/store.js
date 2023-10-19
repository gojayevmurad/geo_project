import { configureStore } from "@reduxjs/toolkit";
import geoLocationSlice from "./geoLocationSlice";

export const store = configureStore({
  reducer: {
    geoLocation: geoLocationSlice,
  },
});
