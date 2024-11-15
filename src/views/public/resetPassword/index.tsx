import { useCallback } from "react";
import { ChangePasswordRequest } from "@/redux/auth/auth-types";
import { loginHeader } from "@/assets/img";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerCode } from "@/core/enums/server-codes";
import { isEmpty } from "@/core/utils/functions";
import { landingPageByUserType } from "@/core/utils/user-utils";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { PASSWORD_REGEX } from "@/core/utils/regex";
import * as Yup from "yup";
import { TEXT_INPUT_DEFAULT_LENGTH } from "@/core/utils/default-length";
import CustomButton from "@/components/customButton";
import PublicLayoutContentWrapper from "@/components/layouts/publicLayout/publicLayoutContentWrapper";
import { useChangePasswordMutation } from "@/redux/auth/auth-api";
import { useAppDispatch } from "@/redux/hooks";
import { authActions } from "@/redux/auth/auth-slice";
import Form from "@/components/form";

interface ValuesI {
  newPassword: string;
  confirmPassword: string;
}

type RequestKeys = keyof ValuesI;

const ResetPasswordView = () => {
  const navigate = useNavigate();
  const { userName, oldPassword } = useLocation()?.state ?? {};

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };
  const [changePasswordMutation] = useChangePasswordMutation();

  const dispatch = useAppDispatch();

  const onSubmit = useCallback((values: ValuesI) => {
    const payload: ChangePasswordRequest = {
      username: userName,
      oldPassword: oldPassword,
      newPassword: values.newPassword,
    };
    changePasswordMutation(payload)
      .unwrap()
      .then((response) => {
        if (response?.code === ServerCode.PASSWORD_CHANGED) {
          toast.success("Your password has been reset successfully"); //"Your password has been changed successfully");
          dispatch(authActions.setAuth(response?.data));
          navigate(landingPageByUserType(response.data.role));
        } else if (!isEmpty(response?.code) && !isEmpty(response?.message)) {
          toast.error(`sample text`);
        }
      })
      .catch((error) => {
        const { code, message } = error?.data ?? {};
        if (!isEmpty(code) && !isEmpty(message)) {
          formik.setErrors({ newPassword: message });
        }
      });
  }, []);

  const formik = useFormik<ValuesI>({
    initialValues: initialValues,
    validationSchema: Yup.object({
      newPassword: Yup.string()
        // .required("New password is required!")
        .matches(
          PASSWORD_REGEX.regex,
          "Password should be 8-10 characters, at least one capital letter, one number and one special character!",
        )
        .max(
          TEXT_INPUT_DEFAULT_LENGTH,
          "Password Length must be less than 100 Characters",

          //`Password must be less than ${TEXT_INPUT_DEFAULT_LENGTH} characters`,
        ),
      confirmPassword: Yup.string()
        // .required("Confirm password is required!")
        .oneOf([Yup.ref("newPassword"), null], `sample text`)
        .matches(
          PASSWORD_REGEX.regex,
          "Password should be 8-10 characters, at least one capital letter, one number and one special character!",
        )
        .max(
          TEXT_INPUT_DEFAULT_LENGTH,
          "Password Length must be less than 100 Characters",
          //`Password must be less than ${TEXT_INPUT_DEFAULT_LENGTH} characters`,
        ),
    }),
    onSubmit,
  });

  return (
    <PublicLayoutContentWrapper
      title={`sample text`}
      headerImage={loginHeader}
      className="!w-[20rem]"
      formikContext={formik}
      description={"Please set new password"} // "Please set new password"
    >
      <Form.Input
        labelText={"New Password*"} //"New Password*"
        type="Password"
        placeholder={"Enter New Password"}
        name="newPassword"
        defaultFocus
      />
      <Form.Input
        type={"Password"} //"Password"
        labelText={"Confirm Password*"} //"Retype New Password*"
        name="confirmPassword"
        placeholder={"Confirm New Password"} //"Retype New Password*"
      />
      <CustomButton
        handleSubmit={formik.handleSubmit}
        btnText={"reset.resetPassword"}
        className="mt-6"
        disabled={
          isEmpty(formik?.values.newPassword) ||
          isEmpty(formik?.values.confirmPassword)
        }
      />
    </PublicLayoutContentWrapper>
  );
};

export default ResetPasswordView;
