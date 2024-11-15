import React, { memo, useEffect, useRef } from "react";
import { Input } from "antd";
import FormItemWrapper from "../formItemWrapper";
import { NUMBER_REGEX } from "@/core/utils/regex";
import { isEmpty } from "@/core/utils/functions";
import "./styles.scss";
import { TEXT_INPUT_DEFAULT_LENGTH } from "@/core/utils/default-length";

type Props = {
  name: string;
  placeholder: string;
  labelText?: string;
  errorMessage?: any;
  isDisabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: "TextArea" | "Text" | "Password" | "Currency" | "NumberOnly";
  handleChange: any;
  handleBlur?: any;
  value: any;
  showErrorText?: boolean;
  defaultFocus?: boolean;
  autoComplete?: string;
  customRef?: React.MutableRefObject<any>;
  visibilityToggle?: boolean;
  wrapperClass?: string;
  allowClear?: boolean;
  maxLength?: number;
};

const CustomInputField = ({
  type = "Text",
  name,
  placeholder,
  labelText,
  isDisabled = false,
  prefix = null,
  suffix = null,
  handleChange,
  handleBlur = undefined,
  value,
  errorMessage,
  showErrorText = true,
  defaultFocus = false,
  autoComplete = undefined,
  customRef = null,
  visibilityToggle = true,
  wrapperClass = ``,
  allowClear = false,
  maxLength = TEXT_INPUT_DEFAULT_LENGTH,
}: Props) => {
  const inputRef = useRef(null);

  useEffect(() => {
    defaultFocus && inputRef.current?.focus();
  }, [defaultFocus]);

  const inputComponent = {
    TextArea: (
      <Input.TextArea
        ref={customRef ?? inputRef}
        onChange={handleChange}
        value={value}
        name={name}
        rows={4}
        className=" !min-h-[50px]"
        placeholder={placeholder}
        disabled={isDisabled}
        maxLength={maxLength}
      />
    ),
    Text: (
      <Input
        ref={customRef ?? inputRef}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        name={name}
        placeholder={placeholder}
        disabled={isDisabled}
        className=" h-10"
        autoComplete={autoComplete}
        suffix={suffix}
        allowClear={allowClear}
        maxLength={maxLength}
      />
    ),
    Currency: (
      <Input
        ref={customRef ?? inputRef}
        onChange={(event) => {
          const value = event.target.value.replaceAll(",", "");
          if (NUMBER_REGEX.regex.test(value) && value.length <= 17) {
            event.target.value = event.target.value.replaceAll(",", "");
            handleChange(event);
          }
        }}
        onBlur={handleBlur}
        value={isEmpty(value) ? `` : Number(value).toLocaleString()}
        name={name}
        placeholder={placeholder}
        disabled={isDisabled}
        className=" h-10"
        autoComplete={autoComplete}
      />
    ),
    NumberOnly: (
      <Input
        ref={customRef ?? inputRef}
        onChange={(event) => {
          const value = event.target.value;
          if (NUMBER_REGEX.regex.test(value) && value.length <= 17) {
            handleChange(event);
          }
        }}
        onBlur={handleBlur}
        value={isEmpty(value) ? 0 : +value}
        name={name}
        placeholder={placeholder}
        disabled={isDisabled}
        className=" h-10"
        autoComplete={autoComplete}
      />
    ),
    Password: (
      <Input.Password
        ref={customRef ?? inputRef}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        name={name}
        placeholder={placeholder}
        disabled={isDisabled}
        rootClassName="h-10"
        autoComplete={autoComplete}
        visibilityToggle={visibilityToggle}
      />
    ),
  };

  const RenderComponent = inputComponent[type];

  return (
    <FormItemWrapper
      labelText={labelText ?? placeholder}
      errorMessage={errorMessage}
      showErrorText={showErrorText}
      wrapperClass={wrapperClass}
    >
      {RenderComponent}
    </FormItemWrapper>
  );
};

export default memo(CustomInputField);
