// Import the RTK Query methods from the React-specific entry point
import { API_BASE_PATH } from "@/core/constants/env-constants";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { trackPromise } from "react-promise-tracker";
import { authActions } from "./auth/auth-slice";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_PATH,
  credentials: "include",
  prepareHeaders(headers, api) {
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: FetchArgs, api, extraOptions) => {
  const requestUrl = args.url;
  let result: FetchBaseQueryError = undefined;
  if (!requestUrl?.includes("chat-message")) {
    result = await trackPromise(baseQuery(args, api, extraOptions) as any);
  } else {
    result = await (baseQuery(args, api, extraOptions) as any);
  }

  ////args.headers["x-is-mobile optional"] = false;
  // console.log("wffw", result);
  let errorStatus = (result as any)?.error?.status;

  // console.log("het err", errorStatus);
  // const hhh = await refreshAuthToken();
  // console.log({ hhh });
  if (
    [401, 403].includes(+errorStatus) &&
    (!requestUrl.includes("auth") || requestUrl.includes("logout"))
  ) {
    // api.dispatch(authActions.clearAuth());
    // Cookies.remove("accessToken");
    // Cookies.remove("refreshToken");
    // SessionStorage.clearStorage();

    const refreshResult = await trackPromise(
      baseQuery(
        {
          url: "/auth/access-token",
          credentials: "include",
          method: "GET",
        },
        api,
        extraOptions,
      ) as any,
    );
    if ((refreshResult as any).data?.success) {
      // console.log((refreshResult as any).data?.success, "ali");
      result = await trackPromise(baseQuery(args, api, extraOptions) as any);
    } else if (
      [401, 403].includes(+errorStatus) &&
      (!requestUrl.includes("auth") || requestUrl.includes("logout"))
    ) {
      api.dispatch(authActions.clearAuth());
    }
  } else if ((result as any)?.error) {
    // console.log({ result });
    const response = await (result as any)?.error?.data;
    // console.log({ response });
    if (response?.success) {
      return response;
    } else if (response?.message) {
      toast.error(response?.message);
    } else {
      toast.error("Oop something went wrong");
    }
  }

  // if (
  //   requestUrl.includes("reset") ||
  //   requestUrl.includes("auth/change") ||
  //   requestUrl.includes("notification/resend") ||
  //   requestUrl.includes("retry-selfie-check")
  // ) {
  //   return result;
  // }
  return await result?.data;
  // }
};

export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  // reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  tagTypes: [
    "Projects",
    "QuestionsAnswers",
    "Geofence",
    "Setting",
    "Pricing",
    "Drivers",
    "Vehicles",
    "Lookup",
    "SpecialPlaces",
    "Promos",
    "Notifications",
    "RideDetails",
    "Reports",
    "Riders",
    "OnGoingRides",
    "ScheduleRides",
    "SelfieCheck",
    "ChatBot",
  ],
  baseQuery: baseQueryWithRefreshToken, //trackAsyncOperation(baseQuery),

  // The "endpoints" represent operations and requests for this server
  endpoints: () => {
    return {};
  },
});
