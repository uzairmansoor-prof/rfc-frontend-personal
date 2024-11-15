import { Radio } from "antd";
import React from "react";
import "./styles.scss";
import { isEmpty } from "@/core/utils/functions";

export type RadioItemOptionsI = Array<{
  value: string | number;
  title: string | React.ReactNode;
  disabled?: boolean;
}>;

interface Props {
  onChange: Function;
  className?: string;
  value: any;
  radioItemOptions: RadioItemOptionsI;
  fieldName?: string;
  radioButtonStyle?: string;
}
export const RadioGroupComponent = ({
  onChange,
  value,
  radioItemOptions,
  className = ``,
  fieldName = undefined,
  radioButtonStyle = ``,
}: Props) => {
  const handleChange = (event) => {
    event.preventDefault();
    const value = event.target.value;
    if (!isEmpty(fieldName)) {
      onChange(fieldName, value);
      return;
    }
    onChange(value);
  };
  return (
    <Radio.Group onChange={handleChange} value={value} className={className}>
      {radioItemOptions.map(({ value, title, disabled }) => (
        <Radio
          value={value}
          disabled={disabled}
          key={value?.toString()}
          className={radioButtonStyle}
        >
          {title}
        </Radio>
      ))}
    </Radio.Group>
  );
};
