import { Divider, Menu, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./styles.scss";
import Sider from "antd/es/layout/Sider";
import { getMenusByUserType } from "@/core/utils/user-session-route-menus";
import { isEmpty } from "lodash";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

import { landingPageByUserType } from "@/core/utils/user-utils";

const TooltipMenuItem = ({
  title,
  fallBackText,
  isCollapsed,
  IconComponent,
  route,
}) => {
  const menuItem = (
    <NavLink to={route} onClick={(value) => {}}>
      <div className="menu-item-wrapper">
        <div className="menu-item-svg-icon">
          <IconComponent />
        </div>
        <div className="ant-menu-text">{fallBackText}</div>
      </div>
    </NavLink>
  );

  if (!isCollapsed) return <>{menuItem}</>;

  return (
    <Tooltip title={fallBackText} placement="right">
      {menuItem}
    </Tooltip>
  );
};

const CustomSideBar = () => {
  const activeKey = window.location.pathname;
  const roleId = useAppSelector((state: RootState) => state?.auth?.role);

  const navigate = useNavigate();
  const location = useLocation();

  const menuListByUserType = useMemo(
    () => getMenusByUserType(roleId).filter((menu) => !isEmpty(menu?.title)),
    [roleId],
  );

  const [isCollapsed, setIsCollapsed] = useState(false);

  const userSession = useAppSelector((state) => state.auth);

  const handleNavigate = (event) => {
    event.preventDefault();
    navigate(landingPageByUserType(userSession?.role));
  };

  return (
    <Sider
      className="side-bar-container"
      // collapsible
      // breakpoint="lg"

      width={95}
      // onCollapse={(collapsed, type) => {
      //   setIsCollapsed(collapsed);
      // }}
    >
      {/* <div className="w-full flex py-8 company-logo">
        <img
          src={loginHeader}
          className="m-auto w-10 cursor-pointer"
          onClick={handleNavigate}
        />
      </div> */}
      <Menu
        key={location.key}
        defaultSelectedKeys={[activeKey]}
        mode="inline"
        className="menu-container"
      >
        {menuListByUserType?.map(
          ({ route, title, fallBackText, icon: IconComponent }, index) => (
            <>
              {index > 0 && <Divider />}
              <Menu.Item key={route} className="ant-tooltip-open">
                <TooltipMenuItem
                  title={title}
                  fallBackText={fallBackText}
                  IconComponent={IconComponent}
                  isCollapsed={isCollapsed}
                  route={route}
                />
              </Menu.Item>
            </>
          ),
        )}
      </Menu>
    </Sider>
  );
};

export default CustomSideBar;
