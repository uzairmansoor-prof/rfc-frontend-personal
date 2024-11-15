import { Checkbox } from "antd";
import React from "react";
import "./styles.scss";
import { CheckboxProps } from "antd/es/checkbox";
import "./styles.scss";

interface Props extends CheckboxProps {
  text: string;
}
const CustomCheckBox = ({ text, ...props }: Props) => {
  return (
    <Checkbox className="checkbox-container" {...props}>
      {text}
    </Checkbox>
  );
};

export default CustomCheckBox;
