import { CancelSvgIcon } from "@/assets/img/icons";
import { Popconfirm } from "antd";
import { startTransition, useCallback, useRef, useState } from "react";
import ChangePasswordForm from "./changePasswordForm";
import CustomModal from "@/components/customModal";

// import "./styles.scss";
// import "./user-form-modal.scss";
// import UserFormComponent from "./userFormComponent";

export const ChangePasswordModal = () => {
  const valuesRef = useRef(null);
  const [isVisile, setVisible] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState(false);

  const handleToggleModal = (event) => {
    event?.preventDefault();
    setVisible((prev) => !prev);
  };

  const Title = useCallback(() => {
    return (
      <Popconfirm
        placement="topRight"
        title={`sample text`}
        onConfirm={(event) => {
          handleConfirmDiscard(event);
          event.stopPropagation();
        }}
        overlayClassName="discard-popup-confirm--wrapper"
        onCancel={(event) => {
          setConfirmationPopup(false);

          event.stopPropagation();
        }}
        open={confirmationPopup}
        okText={`sample text`}
        cancelText={`sample text`}
      >
        <div className="flex justify-between user-form-modal-title">
          <div>{`sample text`}</div>

          <div onClick={handleCancelModal} className="cursor-pointer">
            <CancelSvgIcon />
          </div>
        </div>
      </Popconfirm>
    );
  }, [confirmationPopup]);

  const handleCancelModal = (event) => {
    if (valuesRef?.current?.isPrompt) {
      setConfirmationPopup(true);
    } else {
      handleToggleModal(event);
    }
  };

  const handleConfirmDiscard = (event) => {
    setConfirmationPopup(false);
    startTransition(() => handleToggleModal(event));
  };

  return (
    <>
      <CustomModal visible={isVisile} title={<Title />}>
        <ChangePasswordForm
          handleToggleModal={handleToggleModal}
          valuesRef={valuesRef}
        />
      </CustomModal>
      <div onClick={handleToggleModal} className="cursor-pointer">
        {`sample text`}
      </div>
    </>
  );
};

export default ChangePasswordModal;
