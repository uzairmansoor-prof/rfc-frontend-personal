import { defaultProfileImage } from "@/assets/img";
import { LOGIN_ROUTE } from "@/core/constants/route-constants";
import { Dropdown, MenuProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Image } from "../image/image";

import "./profile-dropdown.scss";
import { DownOutlined } from "@ant-design/icons";
// import { UserApi } from "@/core/api/user-api";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { authActions } from "@/redux/auth/auth-slice";
import { useLogoutMutation } from "@/redux/auth/auth-api";
import { SessionStorage } from "@/core/utils/sessionStorage";
import Cookies from "js-cookie";
// import { listingInputSearchActions } from "@/redux/listing-search-input";

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userSession = useAppSelector((state: RootState) => state?.auth);

  const [logoutMutation] = useLogoutMutation();
  const handleLogout = () => {
    sessionStorage.removeItem("context");
    logoutMutation(undefined)
      .unwrap()
      .then((response) => {
        dispatch(authActions.clearAuth());
        // dispatch(listingInputSearchActions.resetAllListingInputSearchSlice());
        navigate(LOGIN_ROUTE);
        Cookies.remove("access-token");
        Cookies.remove("refresh-token");

        SessionStorage.clearStorage();
      })
      .finally(() => {
        dispatch(authActions.clearAuth());
        // dispatch(listingInputSearchActions.resetAllListingInputSearchSlice());
        navigate(LOGIN_ROUTE);
        Cookies.remove("access-token");
        Cookies.remove("refresh-token");
        SessionStorage.clearStorage();
      });
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  const items: MenuProps["items"] = [
    // {
    //   label: <ChangePasswordModal />,
    //   key: "changePassword",
    // },
    // {
    //   type: "divider",
    // },
    {
      label: `Logout`,
      key: "logout",
    },
  ];
  const [userPicture, setUserPicture] = useState(defaultProfileImage);

  useEffect(() => {
    // handlefetchUserPicture(userSession?.picture);
  }, [userSession]);

  const handlefetchUserPicture = useCallback((pictureName) => {
    // UserApi.getUserImage(pictureName).then(async (response) => {
    //   const blobResponse = await new Blob([response]);
    //   if (blobResponse.size > 0) {
    //     setUserPicture(URL.createObjectURL(blobResponse));
    //   }
    // });
  }, []);

  //

  return (
    <Dropdown
      menu={{
        items: items.filter(({ key }) =>
          key === "profile"
            ? !window.location.pathname.includes("profile")
            : true,
        ),
        onClick,
      }}
      trigger={["click"]}
    >
      <div className="profile-dropdown">
        <Image
          className="profile-dropdown-image ml-2"
          src={
            userSession?.userPicture
              ? `${userSession.userPicture}`
              : // `${API_BASE_PATH}/image/${userSession.userPicture}`
                defaultProfileImage
          }
        />
        <div className="profile-dropdown-info ">
          <div className="truncate profile-dropdown-info-name">
            {userSession?.email}
          </div>
          {/* <div className="truncate profile-dropdown-info-email">
            {userSession?.userName}
          </div> */}
        </div>
        <DownOutlined className="ml-4 [&>svg]:text-[.6rem]" />
      </div>
    </Dropdown>
  );
};
