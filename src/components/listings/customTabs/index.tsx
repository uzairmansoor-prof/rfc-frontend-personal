import { Badge, Tabs, TabsProps } from "antd";
import React, { useState } from "react";
import "./styles.scss";
import { useLocation } from "react-router-dom";

export type TabsItemsType = Array<{
  label: string;
  badgeCount?: number;
  content: React.ReactNode;
}>;
interface Props {
  tabsItems: TabsItemsType;
  onChangeTab?: Function;
  destroyInactiveTabPane?: boolean;
}

export const CustomTabs = ({
  tabsItems,
  onChangeTab = undefined,
  destroyInactiveTabPane = false,
}: Props) => {
  const location = useLocation();

  const [activeKey, setActiveKey] = useState(location.state?.activeTab ?? "1");

  const handleChangeTab = (tab) => {
    setActiveKey(tab);
    onChangeTab?.(tab);
  };

  const items: TabsProps["items"] = tabsItems.map(
    ({ label, badgeCount, content }, index) => ({
      key: (index + 1).toString(),
      label: (
        <div className="tab-label-container">
          <span>{label}</span>
          <Badge overflowCount={10} count={badgeCount} showZero />
        </div>
      ),
      children: content,
    }),
  );

  return (
    <Tabs
      activeKey={activeKey}
      destroyInactiveTabPane={destroyInactiveTabPane}
      items={items}
      onChange={handleChangeTab}
    />
  );
};
