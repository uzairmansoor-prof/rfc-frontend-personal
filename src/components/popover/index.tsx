import React from "react";
import { Popover as AntPopover } from "antd";

import "./popover.scss";

export const Popover = (props) => {
  return (
    <AntPopover content={props.list} title={props.title ?? 0}>
      <span className="custom-popover-text">{props.text}</span>
    </AntPopover>
  );
};
