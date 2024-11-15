import { Modal } from "antd";
import React from "react";
import "./styles.scss";
interface Props {
  className?: string;
  title: string | React.ReactNode;
  visible: boolean;
  children: React.ReactNode;
  width?: number;
  closeable?: boolean;
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomModal = ({
  className,
  title,
  visible,
  width,
  children,
  closeable = false,
  onClose,
}: Props) => {
  const Title = () => (
    <div className=" line-clamp-2 w-4/5 mx-auto" title={title as string}>
      {title}
    </div>
  );
  return (
    <Modal
      className={`${className} custom-modal`}
      open={visible}
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      footer={null}
      title={<Title />}
      centered={true}
      onCancel={onClose}
      width={width}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
