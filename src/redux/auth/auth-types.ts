import { UserType } from "@/core/enums/user-type";

export interface LoginRequest {
  email: string;
  password: string;
  otp: number | null;
}

export interface ChangePasswordRequest {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export interface GuestLoginRequest {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ForgotPasswordResponse {
  message: string;
  code: string;
  data?: any;
}

export interface RoleRecord {
  id: number;
  roleName: string;
}

export interface LoginUser {
  id: string;
  firstName: string;
  lastName: string;
  status: number;
  email: string;
  gender: number;
  age: number;
  phoneNumber: string;
  userPicture: string;
  role: UserType;
  languagePreference: any;
}

export interface LoginResponse extends LoginUser {
  message?: string;
  success?: boolean;
}

export interface ChangePasswordResponse {
  user: LoginUser;
  message?: string;
  code?: string;
}

export interface CityCountryI {
  cityName: string;
  cityId: string;
  countryName: string;
  countryCode: string;
}

export type CityCountryListResponse = Array<CityCountryI>;
