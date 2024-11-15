import { isEmpty } from "@/core/utils/functions";
// import CopyToClipboard from "react-copy-to-clipboard";
import "../table/table.scss";
export const RenderColumnComponent =
  (
    truncate: boolean = false,
    noDataClass: string = undefined,
    showCopy: boolean = false,
  ) =>
  (value: any, record?: any, rowIndex?: any): JSX.Element => {
    if (isEmpty(value)) {
      if (!isEmpty(noDataClass)) {
        return (
          <div className={noDataClass}>
            <hr className="w-2 !mx-0 text-error text-center  bg-error !border-[.1px] border-[#9C9C9C]" />
          </div>
        );
      }
      return (
        <hr className="w-2 !mx-0 text-error  bg-error !border-[.1px] border-[#9C9C9C]" />
      );
    } else if (!truncate) return value;
    return (
      <>
        <div className="truncate" title={value}>
          {value}
        </div>
      </>
    );
  };
