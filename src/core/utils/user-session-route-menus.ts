import {
  DashboardMenuIconSvg,
  LibraryIconSvg,
  ProjectsIconSvg,
  ReviewsMenuIconSvg,
} from "@/assets/img/icons";
import { lazy } from "react";

import AdminLayout from "@/components/layouts/adminLayout";
import PublicLayout from "@/components/layouts/publicLayout";
const ResetPasswordView = lazy(() => import("@/views/public/resetPassword"));

const ManageProjects = lazy(() => import("@/views/private/manage-projects"));
const ManageSheet = lazy(() => import("@/views/private/manage-sheet"));

const ForgotPassword = lazy(() => import("@/views/public/forgotPassword"));
const LoginView = lazy(() => import("@/views/public/login"));

import {
  MANAGE_PROJECTS_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  RESET_PASSWORD_ROUTE,
  MANAGE_SHEET,
  PROMPT_QUESTION_ANSWERS_ROUTE,
  MANAGE_LIBRARIES,
  MANAGE_REVIEWS,
  MANAGE_DASHBOARD,
} from "../constants/route-constants";

import { UserType, UserTypeBaseUrl } from "../enums/user-type";
import { isEmpty } from "./functions";
import QuestionAnswers from "@/views/private/QuestionAnswers";
const { SUPER_ADMIN } = UserType;

const routeMenuMapper = [
  {
    route: LOGIN_ROUTE,
  },
  {
    route: FORGOT_PASSWORD_ROUTE,
  },
  {
    route: RESET_PASSWORD_ROUTE,
  },
  {
    route: MANAGE_DASHBOARD,
    permission: [SUPER_ADMIN],
  },
  {
    route: MANAGE_PROJECTS_ROUTE,
    permission: [SUPER_ADMIN],
  },

  {
    route: MANAGE_SHEET,
    permission: [SUPER_ADMIN],
  },

  {
    route: MANAGE_REVIEWS,
    permission: [SUPER_ADMIN],
  },
  {
    route: MANAGE_LIBRARIES,
    permission: [SUPER_ADMIN],
  },
  {
    route: PROMPT_QUESTION_ANSWERS_ROUTE,
    permission: [SUPER_ADMIN],
  },
];

const userRoutes = {
  [LOGIN_ROUTE]: {
    component: LoginView,
    layout: PublicLayout,
  },
  [FORGOT_PASSWORD_ROUTE]: {
    component: ForgotPassword,
    layout: PublicLayout,
  },
  [RESET_PASSWORD_ROUTE]: {
    component: ResetPasswordView,
    layout: PublicLayout,
  },

  [MANAGE_PROJECTS_ROUTE]: {
    component: ManageProjects,
    layout: AdminLayout,
  },
  [MANAGE_SHEET]: {
    component: ManageSheet,
    layout: AdminLayout,
  },
  [PROMPT_QUESTION_ANSWERS_ROUTE]: {
    component: QuestionAnswers,
    layout: AdminLayout,
  },
};

const userMenus = {
  [MANAGE_DASHBOARD]: {
    title: ["user.pageTitle"],
    fallBackText: "Dashboard",
    icon: DashboardMenuIconSvg,
  },
  [MANAGE_PROJECTS_ROUTE]: {
    title: ["Projects"],
    fallBackText: "Projects",
    icon: ProjectsIconSvg,
  },
  [MANAGE_REVIEWS]: {
    title: ["Reviews"],
    fallBackText: "Reviews",
    icon: ReviewsMenuIconSvg,
  },
  [MANAGE_LIBRARIES]: {
    title: ["Reviews"],
    fallBackText: "Reviews",
    icon: LibraryIconSvg,
  },
  // [RESET_PASSWORD_ROUTE]: {
  //   title: ["user.pageTitle"],
  //   fallBackText: "Dashboard",
  //   icon: DashboardMenuIconSvg,
  // },
};

export const getRoutesByUserType = (userType: UserType) => {
  return routeMenuMapper
    .filter(
      ({ permission }) => isEmpty(permission) || permission?.includes(userType),
    )
    .reduce((prev, curr) => {
      const currentRoute = userRoutes?.[curr?.route];

      if (!currentRoute?.layout?.name) {
        prev.push({
          route: curr?.route,
          component: currentRoute?.component,
          children: [],
        });
        return prev;
      }

      const existing = prev.find(
        ({ component }) => component?.name === currentRoute?.layout?.name,
      );
      if (existing) {
        existing.children.push({ route: curr?.route, ...currentRoute });
      } else {
        prev.push({
          route:
            curr.permission?.length > 0 ? UserTypeBaseUrl?.[userType] : "/",
          component: currentRoute?.layout,

          children: [
            {
              route: curr?.route,
              component: currentRoute?.component,
            },
          ],
        });
      }
      return prev;
    }, []);
};

export const getMenusByUserType = (userType: UserType) => {
  return routeMenuMapper
    .filter(({ permission }) => permission?.includes(userType))
    .map(({ route }) => ({
      route: `${UserTypeBaseUrl[userType]}${route}`,
      ...userMenus?.[route],
    }));
};
