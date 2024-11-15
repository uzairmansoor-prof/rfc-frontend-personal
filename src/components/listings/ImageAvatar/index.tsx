import { Image } from "@/components/image/image";
import { API_BASE_PATH } from "@/core/constants/env-constants";
import ImageName from "../image-name";
import "./style.scss";
import { isEmpty } from "@/core/utils/functions";
type Props = {
  userPicture?: any;
  id?: string;
  className?: string;
  name?: string;
  type?: "User" | "Company" | "Team" | "Driver" | "Rider";
};
const ImageAvatar = ({ userPicture, id, className, name, type }: Props) => {
  return userPicture ? (
    <span className="image-name-wrapper p-2">
      <Image
        className={className}
        src={`${API_BASE_PATH}/image/${id}${(userPicture as string)?.slice(-4)}`}
        alt={id}
      />
      {!isEmpty(type) && !isEmpty(name) && (
        <div title={name} className="truncate">
          {name}
        </div>
      )}
    </span>
  ) : (
    <ImageName imageName={null} text={name} type={type} />
  );
};
export default ImageAvatar;
