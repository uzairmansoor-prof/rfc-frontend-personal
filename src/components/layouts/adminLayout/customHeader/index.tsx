import { Header } from "antd/es/layout/layout";
import React from "react";
import "./styles.scss";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { netsolLogo } from "@/assets/img";

const CustomHeader = () => {
  return (
    <Header className="header-container">
      <div className="font-semibold text-base">
        <img src={netsolLogo} className=" h-8" />
      </div>
      <div className=" flex gap-x-2 items-center">
        <ProfileDropdown />
      </div>
    </Header>
  );
};

export default CustomHeader;
