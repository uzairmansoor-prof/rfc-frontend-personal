import { Form } from "antd";
import { useFormik } from "formik";
import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import * as Yup from "yup";
import { PASSWORD_REGEX } from "@/core/utils/regex";
import { ChangePasswordRequest } from "@/redux/auth/auth-types";
import { ServerCode } from "@/core/enums/server-codes";
import { TEXT_INPUT_DEFAULT_LENGTH } from "@/core/utils/default-length";
import { isEmpty } from "@/core/utils/functions";
import { toast } from "react-toastify";
import CustomInput from "@/components/form/customInput";
import CustomButton from "@/components/customButton";
import { useChangePasswordMutation } from "@/redux/auth/auth-api";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
interface ValuesI {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type RequestKeys = keyof ValuesI;

interface Props {
  valuesRef: any;
  handleToggleModal?: any;
}
const ChangePasswordForm = ({ valuesRef, handleToggleModal }: Props) => {
  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const userSession = useAppSelector((state: RootState) => state.auth);
  const [changePasswordMutation] = useChangePasswordMutation();
  const onSubmit = useCallback((values: ValuesI) => {
    const payload: ChangePasswordRequest = {
      username: userSession?.email,
      oldPassword: values?.oldPassword,
      newPassword: values.newPassword,
    };

    changePasswordMutation(payload)
      .unwrap()
      .then((response) => {
        if (response?.code === ServerCode.PASSWORD_CHANGED) {
          handleToggleModal(null);
        }
      })
      .catch((error) => {
        const { code, message } = error?.data ?? {};
        if (!isEmpty(code) && !isEmpty(message)) {
          toast.error(`sample text`);
        }
      });
  }, []);

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    dirty,
  } = useFormik<ValuesI>({
    initialValues: initialValues,
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required(`Old Password is Required!`) //"Old password is required!")
        .matches(PASSWORD_REGEX.regex, `sample text`)
        .max(
          TEXT_INPUT_DEFAULT_LENGTH,
          "Password Length must be less than 100 Characters",
        ),
      newPassword: Yup.string()
        .required(`New password is required!`) //"")
        .matches(PASSWORD_REGEX.regex, `sample text`)
        .max(
          TEXT_INPUT_DEFAULT_LENGTH,
          "Password Length must be less than 100 Characters",
        ),
      confirmPassword: Yup.string()
        .required("Confirm password is required!")
        .oneOf([Yup.ref("newPassword"), null], "Password must match")
        .matches(PASSWORD_REGEX.regex, PASSWORD_REGEX.message)
        .max(
          TEXT_INPUT_DEFAULT_LENGTH,
          "Password Length must be less than 100 Characters",
        ),
    }),
    onSubmit,
  });

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useImperativeHandle(
    valuesRef,
    () => {
      return {
        isPrompt: dirty,
      };
    },
    [dirty],
  );

  const getFieldProps = useCallback(
    (fieldName: RequestKeys) => {
      return {
        handleChange,
        handleBlur,
        value: values?.[fieldName],
        errorMessage:
          touched?.[fieldName] && errors?.[fieldName]
            ? errors?.[fieldName]
            : null,
        name: fieldName,
      };
    },
    [values, errors, touched],
  );

  return (
    <div className="mt-8">
      <Form layout="vertical">
        <CustomInput
          labelText={"Old Password"}
          type="Password"
          placeholder={"Enter Old Password"} //"Enter Old Password"
          {...getFieldProps("oldPassword")}
          defaultFocus={true}
        />

        <CustomInput
          labelText={"New Password"}
          placeholder={"Enter New Password"}
          type="Password"
          {...getFieldProps("newPassword")}
        />
        <CustomInput
          labelText={"Confirm Password"}
          placeholder={"Confirm New Password"}
          type="Password"
          {...getFieldProps("confirmPassword")}
        />
        <CustomButton
          handleSubmit={handleSubmit}
          btnText={"change.changePassword"}
          btnType="secondary"
        />
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
