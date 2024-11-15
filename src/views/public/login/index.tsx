import { useFormik } from "formik";
import { LoginRequest, LoginResponse } from "@/redux/auth/auth-types";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isEmpty } from "@/core/utils/functions";
import { landingPageByUserType } from "@/core/utils/user-utils";
import { RESET_PASSWORD_ROUTE } from "@/core/constants/route-constants";
import { loginHeader } from "@/assets/img";
import CustomButton from "@/components/customButton";
import PublicLayoutContentWrapper from "@/components/layouts/publicLayout/publicLayoutContentWrapper";
import * as Yup from "yup";
import { EMAIL_VALIDATION_UPDATE } from "@/core/validations/form-validation";
import { useLoginMutation } from "@/redux/auth/auth-api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { authActions } from "@/redux/auth/auth-slice";
import { ServerCode } from "@/core/enums/server-codes";
import Form from "@/components/form";

interface RequestI {
  email: string;
  password: string;
}

const LoginView = () => {
  const [loginErrorText, setLoginErrorText] = useState(undefined);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userSession = useAppSelector((state) => state.auth);
  const setSessionAndNavigation = (response: LoginResponse) => {
    // response.role.id = UserType.SUPER_ADMIN;
    // response.role.roleName = "Admin";
    console.log({ cch: response });
    dispatch(authActions.setAuth(response));
    navigate(landingPageByUserType(response.role));
  };

  const [loginAction] = useLoginMutation();
  const onLogin = useCallback((request: LoginRequest) => {
    loginAction(request)
      .unwrap()
      .then((response) => {
        if (response?.id) {
          setSessionAndNavigation(response);
        }
      })
      .catch((error) => {
        const errorCode = error?.data?.code;
        if (
          [
            ServerCode.PASSWORD_FORCE_CHANGE_WARNING,
            ServerCode.PASSWORD_EXPIRED,
          ].includes(errorCode)
        ) {
          navigate(RESET_PASSWORD_ROUTE, {
            state: {
              userName: request?.email,
              oldPassword: request?.password,
            },
          });
        } else if (!isEmpty(error?.data?.message)) {
          setLoginErrorText(error?.data?.message);
        }
      });
  }, []);

  const formik = useFormik<RequestI>({
    initialValues: { email: undefined, password: undefined },
    validationSchema: Yup.object({
      email: EMAIL_VALIDATION_UPDATE(),
      password: Yup.string().required("Password is required!"),
    }),
    onSubmit: onLogin,
  });

  useEffect(() => {
    setLoginErrorText(undefined);
    const handleKeyup = (e) => {
      if (
        e.key === "Enter" &&
        !(isEmpty(formik.values.email) || isEmpty(formik.values.password))
      ) {
        formik.handleSubmit();
      }
    };

    // Attach the listener to the document
    document.addEventListener("keyup", handleKeyup);

    // Cleanup the listener when the component unmounts
    return () => {
      document.removeEventListener("keyup", handleKeyup);
    };
  }, [formik.values.email, formik.values.password]);

  if (!isEmpty(userSession?.role)) {
    return <Navigate to={landingPageByUserType(userSession?.role)} />;
  }

  return (
    <PublicLayoutContentWrapper
      title={`Login`}
      headerImage={loginHeader}
      className="!w-[20rem]"
      formikContext={formik}
      description={
        "Securely log in with your username and password to access your workspace."
      }
    >
      <Form.Input
        // labelText={"Email*"
        labelText="Email" //"Email*"
        placeholder={`Enter Email`}
        name="email"
        defaultFocus={true}
        showErrorText={
          isEmpty(loginErrorText) &&
          !isEmpty(formik.touched?.email) &&
          !isEmpty(formik.errors?.email)
        }
      />
      <Form.Input
        labelText="Password" //"Password*"
        // labelText={"Password*"
        type="Password"
        name="password"
        placeholder={`Enter Password`}
        showErrorText={
          isEmpty(loginErrorText) &&
          !isEmpty(formik.touched?.password) &&
          !isEmpty(formik.errors?.password)
        }
      />

      {/* <div className="flex justify-between w-full mb-6 -mt-2">
        <AntForm.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox
            onMouseEnter={onMouseEnter.bind({})}
            onMouseLeave={onMouseLeave.bind({})}
          >
            Remember me
          </Checkbox>
        </AntForm.Item>

        <Link
          className="font-semibold text-black"
          to={FORGOT_PASSWORD_ROUTE}
          onMouseEnter={onMouseEnter.bind({})}
          onMouseLeave={onMouseLeave.bind({})}
        >
          {`sample text`}
        </Link>
      </div> */}

      <CustomButton
        handleSubmit={formik.handleSubmit}
        btnText={"Login"} //"Login"
        disabled={
          isEmpty(formik.values.email) || isEmpty(formik.values.password)
        }
      />
      <div className="mt-2 text-sm text-error">{loginErrorText}</div>
    </PublicLayoutContentWrapper>
  );
};

export default LoginView;
