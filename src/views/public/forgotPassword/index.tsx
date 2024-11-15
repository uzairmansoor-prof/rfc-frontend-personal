import React, { useCallback } from "react";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LOGIN_ROUTE } from "@/core/constants/route-constants";
import { toast } from "react-toastify";
import { ServerCode } from "@/core/enums/server-codes";
import { loginHeader } from "@/assets/img";
import CustomButton from "@/components/customButton";
import { isEmpty } from "@/core/utils/functions";
import PublicLayoutContentWrapper from "@/components/layouts/publicLayout/publicLayoutContentWrapper";
import { useForgotPasswordMutation } from "@/redux/auth/auth-api";
import Form from "@/components/form";

interface ValuesI {
  email: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  const [forgotPasswordMutation] = useForgotPasswordMutation();

  const onSubmit = useCallback(async (values: ValuesI) => {
    try {
      const response = await forgotPasswordMutation(values?.email).unwrap();
      if (response?.code === ServerCode.TEMPORARY_PASSWORD_GENERATED) {
        toast.success(response?.message);
        navigate(LOGIN_ROUTE);
      }
    } catch (error) {
      if (error?.data?.code) {
        formik.setErrors({
          email: `${`sample text`}`,
        });
      }
    }
  }, []);

  const formik = useFormik<ValuesI>({
    initialValues: initialValues,
    onSubmit,
  });

  return (
    <PublicLayoutContentWrapper
      title={`sample text`}
      headerImage={loginHeader}
      className="!w-[20rem]"
      formikContext={formik}
      description={
        "Please enter your registered email address to get new password."
      }
    >
      <Form.Input
        labelText={"Email*"}
        placeholder={`sample text`}
        handleChange={formik.handleChange}
        defaultFocus
        handleBlur={formik.handleBlur}
        name="email"
        value={formik.values.email}
      />
      <CustomButton
        handleSubmit={formik.handleSubmit}
        btnText={"btn.forgot"} //"Get New Password"
        disabled={isEmpty(formik.values.email)}
        className="mt-6"
      />
      <div className="text-sm text-error mt-2">{formik.errors?.email}</div>
    </PublicLayoutContentWrapper>
  );
};
export default ForgotPassword;
