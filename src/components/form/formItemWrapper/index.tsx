import { Form } from "antd";
import React from "react";
import "./styles.scss";

interface Props {
  labelText: string;
  errorMessage?: string;
  showErrorText?: boolean;
  children: React.ReactNode;
  wrapperClass?: string;
  hintText?: string;
  hintTextClass?: string;
}

const FormItemWrapper = ({
  labelText,
  errorMessage,
  showErrorText,
  children,
  wrapperClass = ``,
  hintTextClass = ``,
  hintText = undefined,
}: Props) => {
  return (
    <Form.Item
      label={labelText}
      className={`${wrapperClass} ${errorMessage ? "form-item-error-wrapper" : ``}`}
      rootClassName="w-full"
      validateStatus={errorMessage ? "error" : null}
    >
      {children}
      <div
        hidden={errorMessage ? !showErrorText : true}
        className="text-error mt-1 text-[.8rem]"
      >
        {errorMessage}
      </div>
      {hintText && (
        <div className={`text-xs text-error ${hintTextClass} `}>{hintText}</div>
      )}
    </Form.Item>
  );
};

export default FormItemWrapper;
