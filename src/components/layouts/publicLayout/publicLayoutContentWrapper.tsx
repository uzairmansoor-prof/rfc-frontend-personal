import { loginBackground } from "@/assets/img";
import React from "react";
import "./styles.scss";
import Form from "@/components/form";
const PublicLayoutContentWrapper = ({
  title,
  headerImage,
  children,
  className = ``,
  formikContext = undefined,
  description,
}) => {
  return (
    <div className="flex justify-between items-center lgMax:flex-col lgMax:mt-20 public-layoutC-Wrapper">
      <div className="absolute top-8 left-10">
        <img src={headerImage} alt="Logo" className="w-18" />
      </div>
      <div className="w-full md:w-[30%] max-w-[30rem] flex flex-col items-center justify-center px-6">
        <Form formikContext={formikContext}>
          <h2 className="font-bold text-2xl mb-4 text-center">{title}</h2>
          <p className="w-10/12 text-center text-[#636363] mb-6">
            {description}
          </p>
          {children}
        </Form>
      </div>

      <div className="mdMax:hidden w-[41%] lg:mr-16">
        <div className="text-center">
          <img
            src={loginBackground}
            className="w-[100%] h-auto mdMax:w-full  relative lgMax:mt-8"
            alt="Background Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default PublicLayoutContentWrapper;
