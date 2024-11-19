import Form from "@/components/form";
import FormItemWrapper from "@/components/form/formItemWrapper";
import { PROMPT_API_BASE_PATH } from "@/core/constants/env-constants";
import React, { useState } from "react";
import RichTextEditor from "../richTextEditor";
import CustomButton from "@/components/customButton";
import { generateDeltaString, isEmpty } from "@/core/utils/functions";
import { AnswerData, PromptPayloadI } from "../QuestionAnswerComponent";
import { useFormik } from "formik";
import "./styles.scss";
import axios from "axios";
import { toast } from "react-toastify";
interface Props {
  data: AnswerData;
  promptPayload: PromptPayloadI;
  // handleEdit: (record: AnswerData) => void;
  onSaveCancel: (record: AnswerData) => void;
}

const myData = [
  "The provided context does not include specific information regarding the company's date of incorporation.",
  [
    {
      Score: 0.7446588277816772,
      Question:
        "Company & Culture What is the full legal name of your company?",
      Answer:
        "Parent: NETSOL Technologies, Inc. \nNorth & South American Entity: NETSOL Technologies Americas, Inc.\n(NASDAQ CM: NTWK)\n",
      Filters: {
        Product: "Ascent Retail",
        Type: "General",
        Region: "NTA",
        Date: 2022,
      },
    },
    {
      Score: 0.7275537252426147,
      Question:
        "Company & Culture Please provide a list of products and services your company offers.  ",
      Answer:
        "1. NFS Ascent - NETSOL's flagship Asset Finance and Leasing platform\nA proven, reliable, and scalable system for automating and managing the lifecycle of lease, loan, and mobility contracts. Ascent provides a widely distributed turnkey product from an organization with a track record of successful implementations with major banks, equipment, and automotive finance companies in markets around the world.  The solution offers an innovative, productized, configurable, and cloud-enabled offering, enabling a clear pathway for future enhancements along with a technology roadmap for quickly delivering new capabilities to an evolving industry. Ascent, which is deployable on-premises or in the cloud, was built to support the global marketplace. As such, it supports multi-currency, multi-GAAP, multi-lingual, and multi-company as well as a broad range of asset types supporting lease or loan structures.\n\nOmni Point of Sale (Omni POS) – Front office: A highly agile, easy-to-use, web-based originations application – also accessible through mobile devices. Ascent’s Point of Sale delivers an intuitive user experience, with features that enable rapid data capture. Our integrated Omni-channel platform gives tailored content to today’s digitally immersed users across the web while keeping the experience uniform\nCredit Application Processing (CAP) – Middle office: A functionally rich and technically advanced application that covers the complete process of credit underwriting & decision making. CAP is a highly flexible module that allows for a high degree of configuration/parameterization to achieve automation for risk management, credit worthiness, and approval cycles. It can be easily configured according to customer needs. It provides both real-time and scheduled interfacing functionality. \nContract Management System (CMS) – Back Office: Automates end-to-end contract lifecycle management from Contract Activation to Contract Closure. The system provides broad business functionality that enables users to proficiently manage and maintain a contract life cycle covering entire contract management processes in a comprehensive manner.\nWholesale Finance System (WFS) & Dealer Auditor Access System (DAAS):  Automates and manages the floor-plan financing activities of dealers, distributors, and auditors. \n\n2. NFS Digital - NETSOL's suite of Asset Finance and Leasing Digital Applications\nOpens the door to broader opportunities and benefits for corporations, helping them reshape business models, empower workers, improve collaboration and manage customer relationships more effectively. \nMobile Point of Sale (mPOS): Automates Leasing and Finance operations from Origination to Decisioning. \nSelf-Point of Sale (SelfPOS): A dynamic web portal allowing consumers to purchase or finance assets online from any device.\nMobile Customer Self-Service (mAccount): Provides customers with complete visibility of their finance/lease contracts, enabling payments, account modifications, and much more.\nMobile Collection (mCollector): Empowers your collections teams to do more, with easy to use interface and intelligent architecture. \nMobile Field Investigator (mFI): Includes features that enable field resources in performing applicant data verification and helps field representatives achieve their daily tasks while tracking performance.\nMobile Dealer Access System (mDAS): Provides access to dealers on mobile devices to manage and view their floor plan-related loans & units as covered within the wholesale business of the finance company.\nMobile Auditor System (mAuditor): Enables auditors to audit stock, schedule audits & submit results as covered within the wholesale business of the finance company.\n\nThe core modules of NETSOL Financial Suite (NFS) Ascent solution in the scope of this RFP are:\n- NFS Ascent CMS (Contract Management System)\n- mAccount (Customer Self-Service Portal)\n-Additional modules such as mPOS, for Dealer/Partner Self-Service, may be in scope after further understanding.",
      Filters: {
        Product: "Ascent Retail",
        Type: "General",
        Region: "NTA",
        Date: 2022,
      },
    },
    {
      Score: 0.7252167463302612,
      Question:
        "Company & Culture Please provide contact information for three company references based in the U.S. that are currently using your product(s)",
      Answer:
        "\nClient Name: Motorcycle Group\nProduct: NFS Ascent and NFS Digital\n\nClient Name: SCI LeaseCorp\nProduct: NFS Ascent\n\nClient Name: Yamaha Financial Services\nProduct: LeasePak\n\nContact information and reference calls can be arranged by NETSOL on request of the client.\n",
      Filters: {
        Product: "Ascent Retail",
        Type: "General",
        Region: "NTA",
        Date: 2022,
      },
    },
  ],
  0.73,
];
const QuestionAnswerModalComponent = ({
  data,
  promptPayload,
  onSaveCancel,
}: Props) => {
  const formik = useFormik({} as any);

  const [loading, setLoading] = useState(undefined);

  const [formData, setFormData] = useState(data);
  const { question, answer, customPrompt, markReviewed, markCompleted } =
    formData;

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    //setData(name, name === "customPrompt" ? value : checked ?? value);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "customPrompt" ? value : checked ?? value,
    }));
  };

  // const fetchAutomaticallyAnswer = (event) => {
  //   event.stopPropagation();
  //   fetchPromptAnswert(promptPayload?.project.prompt, "automatic");
  // };

  const fetchRegenerateAnswer = (event) => {
    event.stopPropagation();
    fetchPromptAnswert(customPrompt, "regenerate");
  };

  const fetchPromptAnswert = (prompt, type: "regenerate" | "automatic") => {
    const { project, sheetName } = promptPayload;
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
          setFormData((prev) => ({
            ...prev,
            answerScore,
            scoreContext,
            answer: generateDeltaString(answerData) as unknown as string,
          }));
        }
      })
      .catch(() => {
        toast.error("something went wrong");
      })
      .finally(() => {
        setLoading(undefined);
      });
  };
  return (
    <Form formikContext={formik} className=" question-answer-modal-component">
      <FormItemWrapper
        labelText={"Answer"}
        wrapperClass="rich-text-item-wrapper"
      >
        <RichTextEditor
          onChange={handleChange}
          fieldName="answer"
          defaultValue={answer}
        />
      </FormItemWrapper>
      <Form.Input
        labelText="Custom Prompt"
        placeholder="Enter Custom Prompt for Automatic Answering"
        name="customPrompt"
        onChange={handleChange}
        value={customPrompt}
      />

      <div className=" flex items-center  w-full">
        {/* <CustomCheckBox
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
        /> */}

        {/* <CustomButton
          className=" ml-auto mr-2"
          btnSize="small"
          btnType="secondary"
          btnText="Automatically Answer"
          handleSubmit={fetchAutomaticallyAnswer}
          isLoading={loading === "automatic"}
          disabled={loading === "regenerate"}
        /> */}
        <CustomButton
          btnSize="small"
          btnType="secondary"
          className=" ml-auto"
          btnText="Regenerate"
          disabled={isEmpty(customPrompt) || loading === "automatic"}
          handleSubmit={fetchRegenerateAnswer}
          isLoading={loading === "regenerate"}
        />
      </div>
      <div className="flex justify-center mt-4 gap-x-4">
        <CustomButton
          btnText={"Save"}
          btnType="primary"
          handleSubmit={onSaveCancel.bind({}, formData)}
        />
        <CustomButton
          btnText="Cancel"
          btnType="tertiary"
          handleSubmit={onSaveCancel.bind({}, undefined)}
        />
      </div>
    </Form>
  );
};

export default QuestionAnswerModalComponent;
