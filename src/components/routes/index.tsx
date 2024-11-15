/* eslint-disable react/no-children-prop */
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { getRoutesByUserType } from "@/core/utils/user-session-route-menus";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import NotFound from "@/views/public/NotFound";
import { LOGIN_ROUTE } from "@/core/constants/route-constants";
import { isEmpty } from "@/core/utils/functions";
import { landingPageByUserType } from "@/core/utils/user-utils";
import { Suspense } from "react";
import SuspenseFallback from "@/views/public/suspenseFallback";
import ErrorBoundary from "@/views/public/errorBoundary";

const RouteContainer = () => {
  const { role } = useAppSelector((state: RootState) => state.auth);
  const userRouteList = getRoutesByUserType(role);
  return (
    <Router>
      <Routes>
        {userRouteList.map(
          ({ route: baseRoute, component: Layout, children }) => {
            return (
              <Route
                path={baseRoute}
                key={baseRoute}
                element={<Layout />}
                children={children?.map(
                  ({ route, component: Component }, index) => {
                    return (
                      <>
                        <Route
                          path={`${baseRoute}${route}`}
                          key={route}
                          element={
                            <ErrorBoundary>
                              <Suspense fallback={<SuspenseFallback />}>
                                <Component />
                              </Suspense>
                            </ErrorBoundary>
                          }
                        />
                        {index === children?.length - 1 ? (
                          baseRoute === "/" ? (
                            <Route
                              path="/"
                              key={"*"}
                              element={
                                <ErrorBoundary>
                                  <Suspense fallback={<SuspenseFallback />}>
                                    <Navigate to={LOGIN_ROUTE} />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />
                          ) : (
                            <Route
                              path="*"
                              key={"*"}
                              element={
                                <ErrorBoundary>
                                  <NotFound />
                                </ErrorBoundary>
                              }
                            />
                          )
                        ) : null}
                      </>
                    );
                  },
                )}
              />
            );
          },
        )}
        <Route
          path="*"
          element={
            isEmpty(role) ? (
              <Navigate to={LOGIN_ROUTE} />
            ) : userRouteList?.length === 2 ? (
              <Navigate to={landingPageByUserType(role)} />
            ) : (
              <ErrorBoundary>
                <NotFound />
              </ErrorBoundary>
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default RouteContainer;
