import React, { memo, useEffect, useRef, useState } from "react";
import { Input, InputProps } from "antd";
import FormItemWrapper from "../formItemWrapper";
import { NUMBER_REGEX } from "@/core/utils/regex";
import { isEmpty } from "@/core/utils/functions";
import "./styles.scss";
import { TEXT_INPUT_DEFAULT_LENGTH } from "@/core/utils/default-length";
import { useField } from "formik";
import { TextAreaProps } from "antd/es/input";

interface Props extends InputProps {
  name: string;
  labelText: string;
  wrapperClass?: string;
  maxLength?: number;
  showErrorText?: boolean;
  visibilityToggle?: boolean;
  customRef?: React.MutableRefObject<any>;
  defaultFocus?: boolean;
  suffix?: React.ReactNode;
  hintText?: string;
  rows?: number;
  type?: "TextArea" | "Text" | "Password" | "Currency" | "NumberOnly";
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; //Define the type for handleChange
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Define the type for handleBlur
  labelElement?: (value: string) => React.ReactNode;
}

const CustomInputField = ({
  labelText,
  maxLength = TEXT_INPUT_DEFAULT_LENGTH,
  showErrorText = true,
  defaultFocus,
  customRef,
  visibilityToggle,
  wrapperClass = ``,
  type = "Text",
  hintText = undefined,
  labelElement,
  suffix = null,
  rows = 4,
  ...props
}: Props) => {
  const [field, meta] = useField({ name: props.name });

  const inputRef = useRef(null);

  const [defaultFocusError, setDefaultFocusError] = useState(false);
  useEffect(() => {
    defaultFocus && inputRef.current?.focus();
  }, [defaultFocus]);

  const inputComponent = {
    TextArea: (
      <Input.TextArea
        {...field}
        {...(props as unknown as TextAreaProps)}
        ref={customRef ?? inputRef}
        rows={rows}
        className=" !min-h-[50px]"
        maxLength={maxLength}
      />
    ),
    Text: (
      <Input
        ref={customRef ?? inputRef}
        {...field}
        {...props}
        className=" h-10"
        maxLength={maxLength}
        // onClick={(event) => {
        //   console.log("click");
        //   handleDefaultFocusShowError(event);
        // }}
        // onKeyUp={(event) => {
        //   console.log("key down", event.key);
        //   event.key === "Tab" && handleDefaultFocusShowError(event);
        // }}
      />
    ),
    Currency: (
      <Input
        ref={customRef ?? inputRef}
        {...field}
        {...props}
        className=" h-10"
        maxLength={maxLength}
        onChange={(event) => {
          const value = event.target.value.replaceAll(",", "");
          if (NUMBER_REGEX.regex.test(value) && value.length <= 17) {
            event.target.value = event.target.value.replaceAll(",", "");
            props.onChange(event);
          }
        }}
        value={Number(field.value).toLocaleString()}
      />
    ),
    NumberOnly: (
      <Input
        ref={customRef ?? inputRef}
        {...field}
        {...props}
        className=" h-10"
        maxLength={maxLength}
        onChange={(event) => {
          const value = event.target.value;
          if (NUMBER_REGEX.regex.test(value) && value.length <= 17) {
            // eslint-disable-next-line no-unsafe-optional-chaining
            (props?.onChange ?? field?.onChange)(event);
          }
        }}
        suffix={suffix}
        value={isEmpty(field.value) ? "" : field.value}
      />
    ),
    Password: (
      <Input.Password
        ref={customRef ?? inputRef}
        {...field}
        {...props}
        className=" h-10"
        maxLength={maxLength}
        visibilityToggle={visibilityToggle}
      />
    ),
  };

  const RenderComponent = inputComponent[type];

  const ReadOnlylabelText = labelElement?.(field?.value);
  return (
    <FormItemWrapper
      labelText={labelText ?? props.placeholder}
      errorMessage={meta?.touched && meta?.error ? meta?.error : undefined}
      showErrorText={showErrorText}
      wrapperClass={wrapperClass}
      hintText={hintText}
    >
      {ReadOnlylabelText ?? RenderComponent}
    </FormItemWrapper>
  );
};

export default memo(CustomInputField);
