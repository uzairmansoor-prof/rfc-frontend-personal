import React, { useCallback, useState } from "react";
import CustomButton from "@/components/customButton";
import Form from "@/components/form";
import { useFormik } from "formik";
import { AddPersonIconSvg, EditPencilIcon } from "@/assets/img/icons";
import RichTextEditor from "../richTextEditor";
import FormItemWrapper from "@/components/form/formItemWrapper";
import { debounce, generateDeltaString } from "@/core/utils/functions";
import { Skeleton } from "antd";
import "./styles.scss";
import CustomCheckBox from "@/components/customCheckBox";
import axios from "axios";
import { PROMPT_API_BASE_PATH } from "@/core/constants/env-constants";
import ProgressBar from "./ProgressBar";
export interface AnswerData {
  _id: string;
  question: string;
  answer: string;
  customPrompt: string;
  markReviewed: boolean;
  markCompleted: boolean;

  answerScore: number;
  scoreContext: any;
}

export interface PromptPayloadI {
  project: {
    prompt: string;
    regionName: string;
    productName: string;
  };
  sheetName: string;
}
interface Props {
  data: AnswerData;
  promptPayload: PromptPayloadI;
  handleEdit: (record: AnswerData) => void;
  setData: (fieldName: string, value: any, additionalData?: any) => void;
  isLoading: boolean;
  // setUILoaded?: any
}
const QuestionAnswerComponent = ({
  data,
  promptPayload,
  setData,
  handleEdit,
  isLoading,
  // setUILoaded
}: Props) => {
  const formik = useFormik({} as any);

  const [loading, setLoading] = useState(undefined);

  const {
    question,
    answer,
    markReviewed,
    markCompleted,
    answerScore,
    scoreContext,
  } = data;

  const handleChange = useCallback(
    debounce(async (event) => {
      const { name, value, checked } = event.target;
      if (name === "answer") {
        setData(name, value, {
          answerScore: null,
          scoreContext: null,
        });
        return;
      }
      setData(name, name === "customPrompt" ? value : checked ?? value);
    }, 500),
    [promptPayload?.sheetName],
  );

  // useEffect(() => {
  //   setUILoaded?.(true)
  // },[])

  const fetchAutomaticallyAnswer = (event) => {
    event.stopPropagation();
    fetchPromptAnswert(promptPayload?.project.prompt, "automatic");
  };

  // useLayoutEffect(() => {
  //   const richTextFormElement = document.querySelector(".read-only-rich-text");

  //   if (richTextFormElement) {
  //     richTextFormElement
  //       .querySelector(".ql-editor")
  //       ?.setAttribute("contenteditable", "false");
  //   }
  // }, []);
  const fetchPromptAnswert = (prompt, type: "regenerate" | "automatic") => {
    const { project, sheetName } = promptPayload;
    // const [answerData, scoreContext, answerScore] = myData;
    // setData("answer", generateDeltaString(answerData), {
    //   answerScore,
    //   scoreContext,
    // });
    setLoading(type);
    axios
      .post(
        `${PROMPT_API_BASE_PATH}/generate`,
        {
          question,
          instructions: prompt,
          filters: {
            Region: project.regionName,
            Product: project.productName,
            Type: sheetName,
          },
          num_docs: 3,
        },
        {
          headers: {
            "Content-Type": "application/json", // Specify content type
            "Access-Control-Allow-Origin": "*"
          },
        },
      )
      .then((response) => {
        if (Array.isArray(response?.data?.response)) {
          const [answerData, scoreContext, answerScore] =
            response?.data?.response ?? [];

          setData("answer", generateDeltaString(answerData), {
            answerScore,
            scoreContext,
          });
        }
      })
      .catch(() => {
        //toast.error("something went wrong");
      })
      .finally(() => {
        setLoading(undefined);
      });
  };

  return (
    <div className=" border-primary rounded-sm question-answer-promp-component">
      <div className=" header">
        <div className=" line-clamp-3" title={question}>
          {question}
        </div>
        <div className=" flex assign-edit-icon-container">
          <AddPersonIconSvg />
          <EditPencilIcon onClick={handleEdit.bind({}, data)} />
        </div>
      </div>

      <Form formikContext={formik} className="content">
        <FormItemWrapper
          labelText={"Answer"}
          wrapperClass="rich-text-item-wrapper read-only-rich-text"
        >
          {isLoading ? (
            <Skeleton paragraph={false} title={true} active />
          ) : (
            <RichTextEditor
              onChange={handleChange}
              fieldName="answer"
              defaultValue={answer}
            />
          )}
        </FormItemWrapper>
        <div className=" flex items-center  w-full">
          <CustomCheckBox
            onChange={handleChange}
            name="markReviewed"
            checked={markReviewed}
            text=" Mark as Reviewed"
          />
          <CustomCheckBox
            name="markCompleted"
            onChange={handleChange}
            checked={markCompleted}
            text=" Mark as Completed"
          />
          <CustomButton
            className=" ml-auto mr-2"
            btnSize="small"
            btnType="secondary"
            btnText="Automatically Answer"
            handleSubmit={fetchAutomaticallyAnswer}
            isLoading={loading === "automatic"}
            disabled={loading === "regenerate" || isLoading}
          />
          {/* {data?.answerScore} */}
          <ProgressBar data={scoreContext} answerScore={answerScore} />
          {/* {answerScore} */}
        </div>
      </Form>
    </div>
  );
};

export default React.memo(QuestionAnswerComponent);
