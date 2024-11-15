import "./styles.scss";
import { useState } from "react";

interface Props {
  children: any;
  title?: string;
  handleSave?: any;
  className?: string;
  isVehicle?: boolean;
  unAssignBtn?: any;
}
const CardFormWrapper = ({
  title,
  handleSave,
  children,
  className,
  unAssignBtn,
  isVehicle = false,
}: Props) => {
  const [isReadOnly, setIsReadOnly] = useState(false);
  return (
    <section
      className={` driver-approval-form-card min-w-[500px]  shrink mb-1 gap-4 user-manage-card w-[20%] grow px-4 py-5 xlgMax:py-2 xlgMax:px-3 bg-white rounded-card ${className}`}
    >
      <div className={`flex justify-between items-center ${title && "mb-4"}`}>
        <div className=" text-[15px] font-semibold ">{title}</div>
        {unAssignBtn}
      </div>
      <div className="form-container">{children?.(isReadOnly)}</div>
    </section>
  );
};

export default CardFormWrapper;
