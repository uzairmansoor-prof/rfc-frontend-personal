import CustomButton from "@/components/customButton";
import React from "react";

interface Props {
  text: string;
  onClick: (sheetName: string) => void;
}
const QuestionAnswerPanelHeader = ({ text, onClick }: Props) => {
  const handleClick = (event) => {
    event.stopPropagation();
    onClick(text);
  };
  return (
    <div className=" flex justify-between items-center">
      {" "}
      <div className=" font-semibold bg-white pr-[3px] z-[1000]">{text}</div>
      <CustomButton
        btnSize="small"
        btnText="Automatically Answer"
        handleSubmit={handleClick}
      />{" "}
    </div>
  );
};

export default QuestionAnswerPanelHeader;
