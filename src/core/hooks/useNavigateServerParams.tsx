import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isEmpty } from "../utils/functions";
import { DEFAULT_PAGE_SIZE } from "../utils/user-utils";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { UserTypeBaseUrl } from "../enums/user-type";

export const UseNavigateStateParams = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAppSelector((state: RootState) => state.auth);

  const generatePathByStateParams = (custom = undefined) => {
    const paramsPayload = {
      currentPage: location.state?.currentPage ?? 1,
      pageSize: DEFAULT_PAGE_SIZE.toString(),
      sortBy: location.state?.orderBy ?? "asc",
      ...custom,
    };
    console.log({ paramsPayload });
    return `?${new URLSearchParams(paramsPayload).toString()}`;
  };

  const handleNavigatePathState = (
    pathName: string,
    state?: Record<string, any>,
  ) => {
    const roleRoute = `${UserTypeBaseUrl[role]}${pathName}`;
    state
      ? navigate(roleRoute, {
          state,
        })
      : navigate(roleRoute);
  };
  const generateObjectByStateParams = useCallback(
    (custom = undefined) => {
      const payload: any = {};

      const { orderBy, orderColumn, currentPage, ...restStateValues } =
        location?.state ?? {};
      if (orderBy) payload.sortBy = orderBy;
      if (orderColumn) payload.sortColumn = orderColumn;
      payload.currentPage = currentPage ?? 1;
      payload.pageSize = DEFAULT_PAGE_SIZE.toString();

      return { ...payload, ...restStateValues };
    },
    [location?.state],
  );

  const handleNavigateStateParams = (stateParams) => {
    navigate(location.pathname, {
      state: isEmpty(stateParams)
        ? undefined
        : {
            ...location.state,
            ...stateParams,
          },
    });
  };

  return {
    generatePathByStateParams,
    handleNavigateStateParams,
    generateObjectByStateParams,
    params: location?.state,
    handleNavigatePathState,
  };
};
