import React, { useState } from "react";
import { Select, Spin } from "antd";
import "./styles.scss";
import FormItemWrapper from "../form/formItemWrapper";
import { isEmpty } from "@/core/utils/functions";
import { CustomDropdownArrowIconSvg } from "@/assets/img/icons";

const Option = Select.Option;

export interface IOption<T> {
  value: T;
  text?: string;
  optionDisabled?: boolean;
  optionDisableMessage?: string;
}

export interface IDropdownOption {
  [key: string]: string | number;
}

type Props = {
  label?: string;
  selectedValue?: number | string | string[];
  defaultValue?: any;
  options: IOption<number>[] | any[];
  onChange?: any;
  placeholder?: string;
  className?;
  disabled?: boolean;
  labelInValue?: boolean;
  prefixIcon?: React.ReactNode;
  allowClear?: boolean;
  error?: any;
  fieldName?: string;
  valueProperty?: any;
  textProperty?: any;
  mode?: "multiple" | "tags";
  mandatory?: boolean;
  renderOptionText?: (data: any) => string;
  serverSearch?: {
    onSearch: (value: string) => void;
    promiseInProgress: boolean;
  };
  customRef?: any;
  showTooltip?: boolean;
  wrapperClassName?: string;
  hintText?: string;
  onBlur?: any;
};

const CustomSelect = ({
  label,
  selectedValue,
  options,
  valueProperty = "_id",
  prefixIcon,
  textProperty = "name",
  onChange,
  placeholder,
  defaultValue,
  fieldName = "",
  className = "", //"mb-lg-0 mb-4",
  disabled,
  labelInValue = false,
  allowClear = true,
  error = null,
  mode = null,
  serverSearch = undefined,
  renderOptionText = null,
  customRef = undefined,
  mandatory = false,
  wrapperClassName = "",
  hintText = "",
  onBlur = undefined,
}: Props) => {
  const optionFilter = (input, option) => {
    const optionText: string = renderOptionText
      ? renderOptionText(option?.optiondata)
      : option?.optiondata[textProperty];
    return (
      optionText.toString().toLowerCase().indexOf(input?.toLowerCase()) >= 0
    );
  };

  const handleChange = (value, e) => {
    if (Array.isArray(value)) setIsAutoFocus(true);
    if (!isEmpty(fieldName)) {
      onChange(fieldName, value);
      return;
    }
    onChange(value, Array.isArray(value) ? e?.[0]?.optiondata : e?.optiondata);
  };

  const [isAutoFocus, setIsAutoFocus] = useState(false);

  const renderLocalizeOptionText = (option) => {
    if (option?.[textProperty]?.fallBackText) {
      const { text, fallBackText } = option[textProperty];
      return fallBackText;
    }
    return option[textProperty];
  };

  const renderOption = (option) => {
    if (renderOptionText) {
      return renderOptionText(option);
    } else {
      return renderLocalizeOptionText(option);
    }
  };
  return (
    <>
      <FormItemWrapper
        labelText={mandatory ? label + "*" : label}
        showErrorText={true}
        errorMessage={error}
        wrapperClass={wrapperClassName}
      >
        {prefixIcon && (
          <div className="prefix-icon-wrapper absolute z-10 top-2.5 left-2.5">
            {prefixIcon}
          </div>
        )}
        <Select
          onBlur={onBlur}
          id={fieldName || label}
          labelInValue={labelInValue}
          allowClear={allowClear}
          rootClassName="custom-select"
          disabled={disabled}
          maxTagCount="responsive"
          mode={mode}
          autoFocus={isAutoFocus}
          showSearch={options?.length !== 1}
          suffixIcon={
            <CustomDropdownArrowIconSvg />
            // !isEmpty(serverSearch) ? (
            //   <SearchOutlined className=" text-primary" />
            // ) : undefined
          }
          className={`${className} ${prefixIcon ? "prefix-select-style" : ""} `}
          defaultValue={defaultValue ?? undefined}
          value={selectedValue ?? undefined}
          placeholder={placeholder}
          optionFilterProp="children"
          filterOption={!isEmpty(serverSearch) ? false : optionFilter}
          notFoundContent={
            serverSearch?.promiseInProgress ? (
              <Spin size="small" />
            ) : serverSearch?.onSearch ? (
              "No Data"
            ) : null
          }
          onChange={handleChange}
          onSearch={serverSearch?.onSearch}
          key={placeholder}
          ref={customRef}
        >
          {options?.map((option) => (
            <Option
              key={option[valueProperty]}
              value={option[valueProperty]}
              disabled={!!option?.optionDisabled}
              optiondata={option}
            >
              <div
                style={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {renderOption(option)}
              </div>
            </Option>
          ))}
        </Select>

        {hintText && <p className="mt-1 text-xs text-black">{hintText}</p>}
      </FormItemWrapper>
    </>
  );
};

export default CustomSelect;
