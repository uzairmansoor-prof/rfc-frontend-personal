// import { listingInputSearchReducer } from "./listing-search-input";
import { authReducer } from "./auth/auth-slice";
import { apiSlice } from "./index";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  // listingInputSearchText: listingInputSearchReducer,
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});
