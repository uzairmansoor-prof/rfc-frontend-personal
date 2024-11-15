import { CustomTable } from "@/components/listings/table/CustomTable";
import { ColumnsType } from "antd/es/table";
import { PaginationResponseDTO } from "@/core/types/common";
import { isEmpty } from "@/core/utils/functions";
import { Progress, Tooltip } from "antd";
import CustomIcon from "@/components/customIcon";
import {
  ProjectRecordI,
  ProjectStatusPayloadI,
} from "@/redux/projects/project-types";
import { formatToDayMonthYear } from "@/core/utils/date-utils";
import ActiveInActiveDropdown from "@/components/listings/activeInActiveDropdown";
import {
  MANAGE_SHEET,
  PROMPT_QUESTION_ANSWERS_ROUTE,
} from "@/core/constants/route-constants";
import { UseNavigateStateParams } from "@/core/hooks/useNavigateServerParams";

interface Props {
  data: PaginationResponseDTO<ProjectRecordI>;
  handleEditProject: any;
  defaultSort?: any;
  handleToggleProjectStatus: (record: ProjectStatusPayloadI) => void;
}

const ProjectTable = ({
  data,
  handleEditProject,
  defaultSort,
  handleToggleProjectStatus,
}: Props) => {
  const columnSortProps = (fieldName: string) => {
    if (isEmpty(fieldName)) return {};
    return {
      sorter: true,
      sortDirections: ["ascend", "descend", "ascend"],
      ...(defaultSort?.orderColumn === fieldName && {
        defaultSortOrder: defaultSort?.orderBy,
      }),
    };
  };

  const { handleNavigatePathState } = UseNavigateStateParams();

  const rowClickHandler = (record: ProjectRecordI) => {
    if (record?.totalQuestions === 0) {
      handleNavigatePathState(MANAGE_SHEET, {
        project: record,
      });

      return;
    }
    handleNavigatePathState(PROMPT_QUESTION_ANSWERS_ROUTE, {
      project: record,
    });
  };

  const columns: ColumnsType<ProjectRecordI> = [
    {
      title: `Name`,
      dataIndex: "name",
      width: 180,
      render: (_, { name, clientName }) => (
        <div>
          <span style={{ fontWeight: "bold" }}>{name}</span> <br />
          <span style={{ color: "#6B6B6B" }}>{clientName}</span>
        </div>
      ),
    },
    {
      title: `Completed Questions`,
      dataIndex: "completedCount",
      width: 200,
      render: (completedQuestions, { totalQuestions }) => (
        <Progress
          percent={parseFloat(
            ((completedQuestions * 100) / totalQuestions).toFixed(2),
          )}
          status="active"
        />
      ),
    },
    {
      title: `Reviewed Questions`,
      dataIndex: "reviewedCount",
      width: 200,
      render: (reviewedQuestions, { totalQuestions }) => (
        <Progress
          percent={parseFloat(
            ((reviewedQuestions * 100) / totalQuestions).toFixed(2),
          )}
          status="active"
        />
      ),
    },
    {
      title: `Owner`,
      dataIndex: "owner",
      width: 180,
    },
    {
      title: `Date Created`,
      dataIndex: "createdAt",
      width: 150,
      render: (createdAt) => (
        <span style={{ fontWeight: "bold" }}>
          {createdAt ? formatToDayMonthYear(createdAt) : "--"}
        </span>
      ),
    },
    {
      title: `Due Date`,
      dataIndex: "dueDate",
      width: 150,
      render: (dueDate) => (
        <span style={{ color: "#6B6B6B" }}>
          {formatToDayMonthYear(dueDate)}{" "}
          {/* Using the formatToDayMonthYear function */}
        </span>
      ),
    },
    {
      title: `Status`,
      dataIndex: "status",
      align: "center",
      width: 130,
      render: (value, record) => (
        <ActiveInActiveDropdown
          status={value ?? 1}
          onChangeStatus={(status) =>
            handleToggleProjectStatus({ _id: record._id, status })
          }
        />
      ),
    },
    {
      title: `Actions`,
      dataIndex: "",
      align: "center",
      width: 97,
      render: (_, record) => (
        <Tooltip title={`Edit`}>
          <div
            className="underline cursor-pointer text-primary"
            onClick={(event) => {
              event.stopPropagation();
              handleEditProject(record);
            }}
          >
            <CustomIcon icon="Edit" className="text-[18px] " />
          </div>
        </Tooltip>
      ),
    },
  ];

  return (
    <CustomTable
      data={data?.content}
      columns={columns.map((column) => ({
        ...column,
        ...((column as any).dataIndex !== "status" && {
          ...columnSortProps((column as any).dataIndex),
        }),
      }))}
      rowClickHandler={rowClickHandler}
      pagination={true}
      totalRecords={data?.totalRecords}
      scrollPosition={21}
      scroll={true}
    />
  );
};

export default ProjectTable;
