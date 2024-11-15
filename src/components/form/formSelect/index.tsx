import CustomSelect, { IOption } from "@/components/customSelect";
import { useField } from "formik";
import React from "react";
interface Props {
  valueProperty?: string;
  textProperty?: string;
  options: IOption<number>[] | any[];
  label: string;
  placeholder: string;
  name: string;
}

const FormSelect = ({ ...rest }: Props) => {
  const [field, meta, helper] = useField({ name: rest.name });
  const handleChange = (value) => {
    helper.setValue(value);
  };
  return (
    <CustomSelect
      {...rest}
      selectedValue={field.value}
      onChange={handleChange}
      onBlur={() => helper.setTouched(true)}
      error={meta?.error}
    />
  );
};

export default FormSelect;
