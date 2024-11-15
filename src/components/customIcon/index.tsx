import React from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined,
  FilePdfOutlined,
  PlayCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  RegionsMenuIconOutlinedSvg,
  DriverStatusApprovedIconSvg,
  DriverStatusDispprovedIconSvg,
  DriverStatusPendingIconSvg,
  CancelSvgIcon,
  PhoneIconSvg,
  ThreeDotMenuIconSvg,
  VehicleIconSvg,
  VehicleRideStatusIconSvg,
  UploadImageSvg,
  DisputeApproved,
  DisputePending,
  DisputeRejected,
  DisputeResolved,
  DriverOfflineIconSvg,
} from "@/assets/img/icons";
interface Props {
  icon: keyof typeof iconComponent;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  tooltipTitle?: string | string[];
  style?: React.CSSProperties;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  fillColor?: string;
}

const iconComponent = {
  RegionsMenu: RegionsMenuIconOutlinedSvg,
  DriverStatusApproved: DriverStatusApprovedIconSvg,
  DriverOffline: DriverOfflineIconSvg,
  DriverStatusDisapproved: DriverStatusDispprovedIconSvg,
  DriverStatusPending: DriverStatusPendingIconSvg,
  Cancel: CancelSvgIcon,
  Phone: PhoneIconSvg,
  ThreeDotMenu: ThreeDotMenuIconSvg,
  Vehicle: VehicleIconSvg,
  VehicleRideStatus: VehicleRideStatusIconSvg,
  UploadImage: UploadImageSvg,
  Delete: DeleteOutlined,
  Edit: EditOutlined,
  LockUser: LockOutlined,
  UnlockUser: UnlockOutlined,
  Reload: ReloadOutlined,
  FilePdf: FilePdfOutlined,
  PlayCircle: PlayCircleOutlined,
  Pending: DisputePending,
  DisputeApproved: DisputeApproved,
  DisputeRejected: DisputeRejected,
  DisputeResolved: DisputeResolved,
  EyeOutlined: EyeOutlined,
};
const CustomIcon = ({
  icon,
  onClick = undefined,
  style,
  disabled = false,
  hidden = false,
  className = "",
  fillColor = undefined,
}: Props) => {
  const SvgComponent = iconComponent[icon];
  return (
    <>
      <SvgComponent
        className={className}
        style={style}
        hidden={hidden}
        fill={fillColor}
        onClick={disabled ? undefined : onClick}
      />
    </>
  );
};
export default CustomIcon;
