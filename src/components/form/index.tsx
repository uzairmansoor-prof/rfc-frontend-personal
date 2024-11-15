import { Form as AntdForm } from "antd";
import { FormikContextType, FormikProvider } from "formik";
import CustomInput from "./customInput/CustomInput";
import FormSelect from "./formSelect";
import CustomDatePicker from "./customDatePicker";

interface Props {
  formikContext: FormikContextType<any>;
  children: any;
  isDrawer?: boolean;
  className?: string;
}

const Form = ({
  formikContext,
  children,
  isDrawer = false,
  className = "",
}: Props) => {
  return (
    <AntdForm
      layout="vertical"
      className={`${isDrawer ? ` mx-auto` : ``} relative ${className}`}
    >
      <FormikProvider value={formikContext}>{children}</FormikProvider>
    </AntdForm>
  );
};

Form.Input = CustomInput;
Form.Select = FormSelect;
Form.DatePicker = CustomDatePicker;

export default Form;
