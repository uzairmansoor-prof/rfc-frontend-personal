import "./styles.scss";
import { Button, Dropdown, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  ProjectStatusEnum,
  ProjectStatusText,
} from "@/redux/projects/project-types";
interface Props {
  status: ProjectStatusEnum;
  onChangeStatus: (status: ProjectStatusEnum) => void;
}
const ActiveInActiveDropdown = ({ status, onChangeStatus }: Props) => {
  const languageOptions = [
    {
      label: ProjectStatusText[ProjectStatusEnum.Active],
      value: ProjectStatusEnum.Active,
    },
    {
      label: ProjectStatusText[ProjectStatusEnum.InActive],
      value: ProjectStatusEnum.InActive,
    },
  ];
  const languageOptionsItems: MenuProps["items"] = (
    languageOptions as any[]
  ).map(({ value, label }) => ({
    key: value,
    label,
    id: value,
    type: undefined,
    //   className: userLanguage === value ? "active-class" : "",
  }));
  const onClick = (event) => {
    event.domEvent.stopPropagation();
    onChangeStatus(+event.key);
  };
  console.log({ languageOptionsItems });
  return (
    <Dropdown
      menu={{ items: languageOptionsItems, onClick }}
      placement="bottomRight"
      arrow
      overlayClassName="status-dropdown-wrapper"
    >
      <Button
        className="status-dropdown-btn m-auto"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="dropdown-button">
          <span className="w-[50px]">{ProjectStatusText[status]}</span>
          <DownOutlined className="[&>svg]:text-[.6rem]" />
        </div>
      </Button>
    </Dropdown>
  );
};

export default ActiveInActiveDropdown;
