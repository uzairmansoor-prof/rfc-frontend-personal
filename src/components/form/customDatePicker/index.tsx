import { DatePicker, DatePickerProps } from "antd";
import dayjs from "dayjs";
import "./styles.scss";

import { useField } from "formik";
import FormItemWrapper from "../formItemWrapper";
import { disabledDate } from "@/core/utils/date-utils";

interface ExtraProps {
  label: string;
  name: string;
}

type Props = ExtraProps & DatePickerProps;

const CustomDatePicker = ({ label, ...rest }: Props) => {
  const [field, meta, helper] = useField({ name: rest.name });
  const handleChange = (
    value: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs],
    stringValue?: string | [string, string],
  ) => {
    helper.setValue(value);
  };

  return (
    <FormItemWrapper
      labelText={label}
      showErrorText={true}
      errorMessage={meta?.error}
      wrapperClass={`[&_.ant-picker]:w-full [&_.ant-picker]:h-[40px] [&_.ant-picker]:px-[4px] [&_.ant-picker-range-separator]:px-[0px] ${
        rest ? `[&_input]:!text-[darkGray]` : ``
      }`}
    >
      {" "}
      <DatePicker
        {...rest}
        {...field}
        disabledDate={disabledDate}
        onChange={handleChange}
      />
    </FormItemWrapper>
  );
};

export default CustomDatePicker;
