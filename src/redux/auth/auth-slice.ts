import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LoginResponse, LoginUser } from "./auth-types";
import Cookies from "js-cookie";

const DEFAULT_AUTH_STATE: LoginUser = {
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  status: undefined,
  email: undefined,
  gender: undefined,
  age: undefined,
  phoneNumber: undefined,
  userPicture: undefined,
  languagePreference: undefined,
  role: undefined,
};

const manageAdminsSlice = createSlice({
  name: "auth-slice",
  initialState: DEFAULT_AUTH_STATE,
  reducers: {
    setAuth: (state, action: PayloadAction<LoginResponse>) => {
      return action.payload;
    },
    clearAuth: () => {
      Cookies.remove("access-token");
      Cookies.remove("refresh-token");
      sessionStorage.clear();
      return DEFAULT_AUTH_STATE;
    },
  },
});

export const { reducer: authReducer, actions: authActions } = manageAdminsSlice;
