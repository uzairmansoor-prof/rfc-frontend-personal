import { defaultProfileImage } from "@/assets/img";
import { Image as AntImage } from "antd";

type Props = {
  className?: string;
  src?: string;
  hidden?: boolean;
  preview?: boolean;
  onError?: any;
  alt?: string;
};

export const Image = ({
  className = "",
  src = "error",
  hidden,
  alt = "image",
  preview = false,
  onError = undefined,
}: Props) => {
  return (
    <AntImage
      className={className}
      src={src}
      alt={alt}
      hidden={hidden}
      fallback={defaultProfileImage}
      preview={preview}
      onError={onError}
    />
  );
};
