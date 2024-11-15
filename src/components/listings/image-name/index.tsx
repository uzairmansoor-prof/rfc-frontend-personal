import { Avatar } from "antd";

import "./image-name.scss";
import { getUserInitials, randomColor } from "@/core/utils/string-utils";
import { API_BASE_PATH } from "@/core/constants/env-constants";
import { isEmpty } from "@/core/utils/functions";
import { useEffect, useState } from "react";
import { defaultProfileImage } from "@/assets/img";

type Props = {
  imageName?: any;
  text?: string;
  type?: "User" | "Company" | "Team" | "Driver" | "Rider";
  status?: any;
  avatarColor?: string;
};

const ImageName = ({ imageName, text, type, avatarColor }: Props) => {
  const userName = getUserInitials(text);

  const [displayImage, setImage] = useState(undefined);

  useEffect(() => {
    setImage(
      typeof imageName === "string" &&
        (imageName?.includes("/src/assets") || imageName?.includes("http"))
        ? imageName
        : `${API_BASE_PATH}/image/${imageName}`,
    );
  }, [imageName]);

  return (
    <div className="image-name-wrapper p-2">
      {imageName ? (
        <Avatar
          size="small"
          src={displayImage}
          onError={() => {
            setImage(defaultProfileImage);
            return true;
          }}
        />
      ) : (
        <Avatar
          size="small"
          style={{ backgroundColor: avatarColor ?? randomColor(userName) }}
        >
          {getUserInitials(text)}
        </Avatar>
      )}

      {!isEmpty(type) && (
        <div title={text} className="truncate">
          {text}
        </div>
      )}
    </div>
  );
};

export default ImageName;
