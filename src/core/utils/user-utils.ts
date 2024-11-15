import { MANAGE_PROJECTS_ROUTE } from "../constants/route-constants";
import { UserType, UserTypeBaseUrl } from "../enums/user-type";

export const DEFAULT_PAGE_SIZE = 10;

export const landingPageByUserType = (userType: UserType) => {
  const UserLandingPage = {
    [UserType.SUPER_ADMIN]: MANAGE_PROJECTS_ROUTE,
  };
  return `${UserTypeBaseUrl[userType]}${UserLandingPage[userType]}`;
};
