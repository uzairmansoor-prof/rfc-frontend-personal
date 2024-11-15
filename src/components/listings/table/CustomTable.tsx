import { isEmpty } from "@/core/utils/functions";
import { Table as AntTable } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { RowClassName } from "rc-table/lib/interface";
import { useEffect, useMemo, useState } from "react";
import "./style.scss";
import { DEFAULT_PAGE_SIZE } from "@/core/utils/user-utils";
import { useLocation } from "react-router-dom";
import { UseNavigateStateParams } from "@/core/hooks/useNavigateServerParams";
import { ExpandableConfig } from "antd/es/table/interface";
// Arabic locale from Ant Design

type Props = {
  className?: string;
  data: any;
  columns: ColumnsType<any>;
  pagination?: TablePaginationConfig | boolean;
  rowClickHandler?: (data, index) => void;
  scroll?: boolean;
  scrollPosition?: number;
  tableLayout?: "auto" | "fixed";
  rowClassName?: string | RowClassName<any>;
  searchFilter?: { key: string; keysToSearch: string[] };
  bodyCellComponent?: any;
  paginationClass?: string;
  totalRecords?: number;
  onChangePageSort?: (pagination: any, sorter: any) => void;
  expandable?: ExpandableConfig<any>;
  defaultCurrentPage?: number;
  activeRowId?: number; // Add drawerData to Props interface
  getActiveRow?: (record: any) => boolean;
};

export const CustomTable = ({
  className,
  data,
  columns,
  pagination = false,
  rowClickHandler = undefined,
  scroll = false,
  scrollPosition = 19,
  tableLayout = "fixed",
  rowClassName = undefined,
  searchFilter = undefined,
  bodyCellComponent = undefined,
  onChangePageSort = undefined,
  paginationClass = undefined,
  totalRecords = undefined,
  expandable = undefined,
  defaultCurrentPage = undefined,
  activeRowId, // Accept drawerData as a prop
  getActiveRow = undefined,
}: Props) => {
  const location = useLocation();
  const [page, setCurrentPage] = useState(1);
  const currentPage = isEmpty(totalRecords)
    ? page
    : location.state?.currentPage ?? defaultCurrentPage ?? page;
  const { handleNavigateStateParams } = UseNavigateStateParams();

  const [resultData, setResultData] = useState([]);
  // const text = useAppSelector((state) => state.listingInputSearchText);
  // const handleApplySearch = useCallback(() => {
  //   const searchColumn = searchFilter?.keysToSearch;
  //   const searchValue = text?.[searchFilter?.key];
  //   if (!isEmpty(searchValue) && searchColumn?.length > 0) {
  //     const output = genericSearch(data, searchColumn, searchValue);
  //     setResultData(output);
  //     startTransition(() => {
  //       handleChangePage(1);
  //     });
  //   } else {
  //     setResultData(data);
  //   }
  // }, [data, text, searchFilter?.keysToSearch]);

  useEffect(() => {
    setResultData(data);
  }, [data]);

  // useEffect(() => {
  //   isEmpty(totalRecords) && handleApplySearch();
  // }, [handleApplySearch, text, totalRecords]);

  const pageParams = useMemo(() => {
    const dataLength = totalRecords ?? resultData?.length;
    if (dataLength === 0) {
      return {
        startingIndex: 0,
        endingIndex: 0,
      };
    }

    const pagieSize =
      (pagination as TablePaginationConfig).pageSize ?? DEFAULT_PAGE_SIZE;
    return {
      startingIndex: dataLength > 0 ? (currentPage - 1) * pagieSize + 1 : 0,
      endingIndex:
        dataLength >= (currentPage - 1) * DEFAULT_PAGE_SIZE + 1 &&
        dataLength <= currentPage * DEFAULT_PAGE_SIZE
          ? dataLength
          : currentPage * DEFAULT_PAGE_SIZE,
    };
  }, [currentPage, resultData, totalRecords]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
    if (!isEmpty(totalRecords) && isEmpty(defaultCurrentPage)) {
      handleNavigateStateParams({ currentPage: page });
    }
  };

  return (
    <>
      <AntTable
        rowClassName={(record) => {
          const shouldHighlightRow = activeRowId && record?.id === activeRowId;
          return getActiveRow?.(record) || shouldHighlightRow
            ? "highlighted-row"
            : "";
        }}
        className={`customTable ${className}`}
        dataSource={resultData}
        tableLayout={tableLayout}
        columns={columns}
        onChange={(pagination, filter, sorter, extra) => {
          if (onChangePageSort) {
            onChangePageSort(pagination, sorter);
            return;
          }

          if (
            extra.action === "sort" &&
            (sorter as any)?.order &&
            totalRecords
          ) {
            handleNavigateStateParams({
              orderBy: (sorter as any).order,
              orderColumn: (sorter as any)?.field,
            });
          }
        }}
        components={{
          body: {
            cell: bodyCellComponent,
          },
        }}
        scroll={
          scroll && {
            y: `calc(100vh - ${scrollPosition}em)`,
          }
        }
        pagination={
          pagination
            ? {
                position: ["bottomRight"],
                ...((pagination as any).position && { pagination }),
                current: currentPage,
                pageSize: DEFAULT_PAGE_SIZE,
                showSizeChanger: false,
                onChange(page) {
                  //
                  handleChangePage(page);
                },
                total: totalRecords,
                showTitle: true,
                showTotal: (totalRecords, range) => {
                  return (
                    <div>
                      {range[0]}-{range[1]} {`of`} {""}
                      {totalRecords} {`Items`}
                    </div>
                  );
                },
              }
            : false
        }
        expandable={expandable}
        onRow={(record, index) => {
          return {
            onClick: (event) => {
              rowClickHandler && rowClickHandler(record, index);
            },
          };
        }}
        rowKey={(record) =>
          window.location.pathname.includes("reconcile-agent")
            ? record?.description
            : record?.id ?? Math.random().toString(36).substring(7)
        }
      />
      {pagination && (
        <div
          className={` hidden absolute -top-[33px] right-[10px]  text-[#808080] ${paginationClass}`}
        >
          {`Showing ${pageParams?.startingIndex ?? 0}-${
            pageParams?.endingIndex ?? 0
          } of ${totalRecords ?? resultData?.length ?? 0} results`}
        </div>
      )}
    </>
  );
};
