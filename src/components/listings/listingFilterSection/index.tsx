import React, { ReactNode } from "react";
import { Divider } from "antd";

interface Props {
  btnProps?: {
    onClickHandler: React.MouseEventHandler<HTMLElement>;
    btnText: string;
    hideNewText?: boolean;
    icon?: "Print" | "Share" | "Plus" | "Export" | "Send";
    btnClass?: string;
  };
  searchProps?: {
    searchKey: string;
    serverSearching?: boolean;
    setTextRef?: any;
    onTextChange?: (value: string) => void;
  };
  children?: ReactNode;
  filterComponent?: ReactNode;

  topComponent?: ReactNode;
  bottomComponent?: ReactNode;
  className?: string;
  title: string;
}

const ListingFilterSection = ({
  btnProps = undefined,
  searchProps,
  children,
  filterComponent,
  topComponent = undefined,
  className = "",
  bottomComponent,
  title,
}: Props) => {
  return (
    <section
      className={` overflow-x-auto bg-white  p-6  flex  flex-col gap-5`}
      style={{ borderRight: "1px solid #E8E8E8" }}
    >
      <div className="text-base font-[500]">{title}</div>

      {topComponent}
      <Divider className=" w-[calc(100%+1.5rem)] my-0 ml-[-.75rem]" />
      {bottomComponent && (
        <div className=" flex flex-col gap-y-6 [&>.ant-form-item]:!my-0">
          {bottomComponent}
        </div>
      )}
    </section>
  );
};

export default ListingFilterSection;
