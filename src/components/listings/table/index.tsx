import { Table as AntTable } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { RowClassName } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import "./table.scss";

type Props = {
  className?: string;
  data: any;
  columns: ColumnsType<any>;
  pagination?: TablePaginationConfig | false;
  rowClickHandler?: (data, index) => void;
  scroll?: boolean;
  scrollPosition?: number;
  tableLayout?: "auto" | "fixed";
  rowClassName?: string | RowClassName<any>;
  searchFilter?: { key: string; keysToSearch: string[] };
};

export const Table = ({
  className,
  data,
  columns,
  pagination = false,
  rowClickHandler = undefined,
  scroll = false,
  scrollPosition = 19,
  tableLayout = "auto",
  rowClassName = undefined,
  searchFilter = undefined,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [resultData, setResultData] = useState([]);
  // const text = useAppSelector((state) => state.listingInputSearchText);

  // const handleApplySearch = useCallback(() => {
  //   const searchColumn = searchFilter?.keysToSearch;
  //   const searchValue = text?.[searchFilter?.key];
  //   if (!isEmpty(searchValue) && searchColumn?.length > 0) {
  //     const output = genericSearch(data, searchColumn, searchValue);
  //     setResultData(output);
  //   } else {
  //     setResultData(data);
  //   }
  //   setCurrentPage(1);
  // }, [data, text, searchFilter?.keysToSearch]);

  useEffect(() => {
    setResultData(data);
  }, [data]);
  // useEffect(() => {
  //   handleApplySearch();
  // }, [handleApplySearch, text]);

  return (
    <AntTable
      className={`table ${className} customTable`}
      dataSource={resultData}
      tableLayout={tableLayout}
      columns={columns}
      rowClassName={rowClassName}
      scroll={
        scroll && {
          y: `calc(100vh - ${scrollPosition}em)`,
        }
      }
      pagination={
        pagination
          ? {
              ...pagination,
              current: currentPage,
              onChange(page, pageSize) {
                setCurrentPage(page);
              },
            }
          : false
      }
      onRow={(record, index) => {
        return {
          onClick: (event) => {
            rowClickHandler && rowClickHandler(record, index);
          },
        };
      }}
    />
  );
};
