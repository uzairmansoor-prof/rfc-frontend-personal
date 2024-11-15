import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { BaseButtonProps } from "antd/es/button/button";
import React from "react";
import "./styles.scss";
import {
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  RESET_PASSWORD_ROUTE,
} from "@/core/constants/route-constants";

interface Props {
  handleSubmit: any;
  btnText?: string;
  disabled?: boolean;
  className?: string;
  buttonColor?: string;
  icon?: "Print" | "Download" | "Plus" | "Export" | "Send";
  btnSize?: BaseButtonProps["size"];
  btnType?: "primary" | "primary-light" | "secondary" | "tertiary";
  isLoading?: boolean;
}

const CustomButton = ({
  btnText = "Save",
  handleSubmit,
  disabled = false,
  className = ``,
  btnType = "primary",
  icon = undefined,
  btnSize = "middle",
  isLoading = false,
}: Props) => {
  const btnIcon = {
    Plus: <PlusOutlined className="text-[small]" />,
    Download: <DownloadOutlined className=" text-base" />,
  };
  const authPages = [
    LOGIN_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    RESET_PASSWORD_ROUTE,
  ].includes(window.location.pathname);
  const defaultClass = authPages ? `w-2/3 h-10` : `h-[2.3rem] min-w-fit w-40`;
  //const buttonText = `sample text`;
  return (
    <Button
      type={"primary"}
      // htmlType={htmlType}
      className={` rounded-[9px]  ${defaultClass} ${
        disabled ? `!text-[darkGray]` : `custom-${btnType}`
      }  ${className} `}
      onClick={handleSubmit}
      icon={icon ? btnIcon[icon] : undefined}
      disabled={disabled}
      size={btnSize}
      loading={isLoading}
    >
      {btnText}
    </Button>
  );
};

export default React.memo(CustomButton);
