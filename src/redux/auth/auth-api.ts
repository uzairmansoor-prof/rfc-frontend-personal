import {
  ChangePasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
} from "./auth-types";
import { apiSlice } from "..";
import { GenericResponse } from "@/core/types/common";
const baseUrl = `/auth`;

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (payload) => ({
        url: `${baseUrl}/login`,
        method: "Post",
        body: payload,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, string>({
      query: (username) => ({
        url: `${baseUrl}/reset-password/${username}`,
        method: "Post",
        body: { email_or_phone_number: username },
      }),
    }),
    changePassword: builder.mutation<
      GenericResponse<LoginResponse>,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: `${baseUrl}/change-password`,
        method: "Post",
        body,
      }),
    }),
    logout: builder.mutation<null, undefined>({
      query: (payload) => ({
        url: `${baseUrl}/logout`,
        method: "Post",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
} = authApi;
