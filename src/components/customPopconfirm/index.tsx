import { Popconfirm, Switch } from "antd";
import { useEffect, useState } from "react";

import "./style.scss";
const CustomPopconfirm = ({
  placement = "topRight",

  showPopAlert = false,
  autostatecheck = false,
  autoState = false,

  title = undefined,
  onConfirm = undefined,
  onCancel = undefined,
  open = false,
  overlayClassName = undefined,
  okText = "Yes",
  cancelText = "No",
  children = undefined,

  isChecked = false,
}) => {
  const [localShowPopAlert, setLocalShowPopAlert] = useState(false);
  const [localAutostatecheck, setLocalAutostatecheck] = useState(autoState);
  const handleConfirm = () => {
    togglePopAlert();
    onConfirm?.();
  };

  useEffect(() => {
    setLocalShowPopAlert(open);
  }, [open]);

  const togglePopAlert = () => {
    setLocalShowPopAlert(!localShowPopAlert);
  };

  const handleCancel = () => {
    onCancel?.();
    togglePopAlert();
  };

  okText = "Yes";
  cancelText = "No";

  return (
    <Popconfirm
      placement={"topRight"}
      title={title}
      onConfirm={handleConfirm}
      overlayClassName={`custom-popupconfirm ${overlayClassName}`}
      onCancel={handleCancel}
      open={
        autostatecheck
          ? undefined
          : autoState
            ? showPopAlert
            : localShowPopAlert
      }
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ className: "custom-primary" }}
      cancelButtonProps={{ className: "custom-tertiary" }}
    >
      {children ? (
        children
      ) : (
        <Switch
          checked={isChecked}
          onChange={() => {
            setLocalShowPopAlert(true);
            setLocalAutostatecheck(autoState);
          }}
        />
      )}
    </Popconfirm>
  );
};

export default CustomPopconfirm;
