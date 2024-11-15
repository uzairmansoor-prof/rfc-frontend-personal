import React, { startTransition, useEffect, useMemo, useState } from "react";
import "./styles.scss";
import {
  useAddQuestionAnswerMutation,
  useLazyQuestionAnswerListingQuery,
  useUpdateQuestionAnswerMutation,
} from "@/redux/questions-answers/questions-answers-api";
import {
  generateDeltaString,
  isEmpty,
  transformData,
} from "@/core/utils/functions";
import ListingFilterSection from "@/components/listings/listingFilterSection";
import AdminLayoutContentWrapper from "@/components/layouts/adminLayout/adminLayoutContentWrapper";
import CustomButton from "@/components/customButton";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { PROMPT_API_BASE_PATH } from "@/core/constants/env-constants";
import QuestionAnswersList from "./Components/QuestionAnswersList";
import { toast } from "react-toastify";
import { MANAGE_PROJECTS_ROUTE } from "@/core/constants/route-constants";
import { UseNavigateStateParams } from "@/core/hooks/useNavigateServerParams";
import { SessionStorage } from "@/core/utils/sessionStorage";
import axiosInstance from "@/core/api";
import { Divider, Progress } from "antd";

export type AnswerLoadingTypo = Record<string, boolean>;
const QuestionAnswers = () => {
  const [selectedSheet, setSelectedSheet] = useState(undefined);

  const [loading, setLoading] = useState<AnswerLoadingTypo>({});
  const [data, setData] = useState({});

  const [isUILoaded, setIsUILoaded] = useState(null);

  const { state } = useLocation();

  const [addQuestionAnswer] = useAddQuestionAnswerMutation();
  const [updateQuestionAnswer] = useUpdateQuestionAnswerMutation();

  const [fetchProjectQuestionsAnswers] = useLazyQuestionAnswerListingQuery();

  const {
    taggedColumns: excelData,
    answerTitleIndex,
    rowStartIndex,
  } = state || {};

  const { handleNavigatePathState } = UseNavigateStateParams();

  const projectId = state?.project?._id;
  useEffect(() => {
    if (!isEmpty(excelData) && projectId) {
      const excelSheetData = transformData(excelData, rowStartIndex, projectId);
      setSelectedSheet(Object.keys(excelSheetData)?.[0] as string);

      setIsUILoaded(false);
      setData(excelSheetData);
    } else if (projectId) {
      (async (projectId) => {
        const response = await fetchProjectQuestionsAnswers(projectId).unwrap();
        // console.log("hey nice", {
        //   response,
        //   length: Object.values(response).length,
        // });
        setSelectedSheet(Object.keys(response)?.[0] as string);
        setIsUILoaded(false);

        startTransition(() => {
          setData(response);
        });
      })(projectId);
    }
  }, [excelData, rowStartIndex]);

  // console.log({ selectedSheet, excelData, answerTitleIndex, rowStartIndex });
  const promptPayload = useMemo(
    () => ({
      regionName: state?.project?.region?.name,
      productName: state?.project?.product?.name,
      prompt: state?.project?.prompt,
    }),
    [state?.project],
  );

  const selectedSheetData = useMemo(() => {
    return !isEmpty(data) && selectedSheet ? data?.[selectedSheet] : null;
  }, [data, selectedSheet]);

  const handleSelectSheet = (event) => {
    setSelectedSheet(event.target.id);
  };

  // const outerElementType = forwardRef((props, ref) => (
  //   <div ref={ref} onWheel={undefined} {...props} />
  // ));

  const handleFetchSheetAnswer = async (event) => {
    event.preventDefault();
    (selectedSheetData as any[]).forEach((record, recordIndex) => {
      const { prompt, regionName, productName } = promptPayload;
      setLoading((prev) => ({
        ...prev,
        [`${recordIndex}_${selectedSheet}`]: true,
      }));
      //  console.log(setLoading, "cheking setloading");
      // console.log(promptPayload, "seeing record");
      // console.log(record, "aaasseeing record");
      //console.log(selectedSheetData.length, "qqqqseeing record");
      axios
        .post(
          `${PROMPT_API_BASE_PATH}/generate`,
          {
            question: record.question,
            filters: {
              Type: selectedSheet,
              Region: regionName,
              Product: productName,
            },
            instructions: prompt,
            num_docs: 3,
          },
          {
            headers: {
              "Content-Type": "application/json", // Specify content type
            },
          },
        )
        .then((response) => {
          if (Array.isArray(response?.data?.response)) {
            const [answerData, scoreContext, answerScore] =
              response?.data?.response ?? [];
            setData((prev) => ({
              ...prev,
              [selectedSheet]: [...prev[selectedSheet]].map(
                (sheetData, currIndex) => {
                  return {
                    ...sheetData,
                    ...(currIndex === recordIndex && {
                      answer: generateDeltaString(answerData),
                      answerScore,
                      scoreContext,
                    }),
                  };
                },
              ),
            }));
          }
        })
        .finally(() => {
          setLoading((prev) => ({
            ...prev,
            [`${recordIndex}_${selectedSheet}`]: false,
          }));
        });
    });
  };
  const [isExported, setIsExported] = useState(
    SessionStorage.getKey("exported") ?? false,
  );

  const handleExportSheet = async (event) => {
    event.preventDefault();

    const action =
      isEmpty(excelData) || isExported
        ? updateQuestionAnswer({
            projectId: state?.project?._id,
            payload: data,
          })
        : addQuestionAnswer({
            payload: data,
            answerTitleCell: answerTitleIndex,
            rowHeaderIndex: rowStartIndex,
          } as any);

    action.unwrap().then(async (res) => {
      if (!isEmpty(res)) {
        try {
          const response = await axiosInstance.get(
            `/questions-answers/export-csv/${projectId}`,
          );

          const contentDisposition = response.headers["content-disposition"];
          // Create a blob from the response data
          let fileName = undefined;
          const matches = contentDisposition.match(
            /filename[^*=]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (matches && matches[1]) {
            fileName = matches[1].replace(/['"]/g, ""); // Remove quotes if present
          }

          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);

          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName); // Specify the file name
          document.body.appendChild(link);
          link.click(); // Trigger the download
          link.parentNode.removeChild(link); // Cleanup
          setIsExported(true);
          SessionStorage.setKey("exported", true);
        } catch (error) {
          console.error("Error downloading CSV:", error);
          // Handle error appropriately, e.g., show an error message
        }
      }
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    const action =
      isEmpty(excelData) || isExported
        ? updateQuestionAnswer({
            projectId: state?.project?._id,
            payload: data,
          })
        : addQuestionAnswer({
            payload: data,
            answerTitleCell: answerTitleIndex,
            rowHeaderIndex: rowStartIndex,
          } as any);

    action.unwrap().then((res) => {
      if (!isEmpty(res)) {
        if (isEmpty(excelData)) {
          toast.success("Question Answer Updated Successfully");
        } else {
          toast.success("Question Answer Saved Successfully");
        }
        SessionStorage.removeKey("exported");
        handleNavigatePathState(MANAGE_PROJECTS_ROUTE);
      }
    });
  };

  // const Row = ({ index, style }) => (
  //   <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
  //     Row {index}
  //   </div>
  // );

  // console.log({
  //   selectedSheet,
  //   selectedSheetlength: selectedSheetData?.length,
  //   main: data,
  //   length: data?.[selectedSheet]?.length,
  // });

  const currentSheetLoading = (currSheet) =>
    Object.keys(loading).filter((key) => {
      const [index, ...sheetName] = key?.split("_") ?? [];
      // console.log({ sheetName, selectedSheet, yes: sheetName === currSheet });
      return sheetName.join("_")?.toString() === currSheet;
    });

  // console.log({ currentSheetLoading });
  return (
    <div className="grid grid-cols-[270px_1fr]  h-full ">
      <ListingFilterSection
        title="Sample RFP Documents"
        bottomComponent={
          <>
            <div className=" font-semibold  text-base">Content</div>
            <div className=" sheet-name-wrapper">
              {Object.keys(data).map((sheet, index, lst) => {
                const sheetLoadingValues = currentSheetLoading(sheet);
                return (
                  <>
                    <div key={index}>
                      <h4
                        className={`sheets flex !mb-0 gap-x-2 items-center  hover:font-semibold hover:cursor-pointer ${selectedSheet === sheet ? `!font-semibold` : `font-normal`} `}
                        role="button"
                        id={sheet}
                        onClick={handleSelectSheet}
                      >
                        {sheet}{" "}
                      </h4>
                      {/* {
                      Object.values(loading).filter((value) => value === false)
                        .length
                    }
                    /{selectedSheetData.length} */}
                      <Progress
                        percent={parseFloat(
                          (
                            (Object.entries(loading).filter(([key, value]) => {
                              return (
                                sheetLoadingValues.includes(key) &&
                                value === false
                              );
                            }).length *
                              100) /
                            sheetLoadingValues.length
                          ).toFixed(2),
                        )}
                        status="active"
                      />
                    </div>
                    {index !== lst.length - 1 && (
                      <Divider className=" w-[calc(100%)] my-2 " />
                    )}
                  </>
                );
              })}
            </div>
          </>
        }
      />
      <AdminLayoutContentWrapper
        title={null}
        className=" overflow-y-auto max-h-[calc(100vh-76px)] questions-answers-container"
      >
        {/* <div className="bg-white mt-2 p-4 border-[1px] border-[#A7C3E8] shadow-primary-content border-solid flex rounded-md shadow-md [&>svg]:w-[120px]">
            <QuestionAnswerHeaderQuestionSvg />
            <div className="grid gap-y-2">
              <h5 className="text-lg text-primary-light font-semibold mb-0">
                Resolve 50 Unanswered Questions in Sheet 1, Sheet 2 and Sheet 3
              </h5>
              <p className="text-gray-600 mb-0 ">
                We will automatically complete any unanswered entries using the
                provided questions and any relevant compliance sets.
              </p>
              <div className="flex mt-2  items-center">
                <CustomButton
                  className={`px-4 py-2 "}`}
                  handleSubmit={undefined}
                  btnText="Answer Selected Questions Automatically"
                />
                <span className="mx-2 text-gray-600">Or</span>
                <CustomButton
                  btnType="primary-light"
                  handleSubmit={undefined}
                  className={`px-4 py-2 rounded-md text-white `}
                  btnText="Answer Selected Questions Automatically"
                />
              </div>
            </div>
          </div> */}
        <div className="flex gap-x-4 ml-auto w-fit items-center py-4 ">
          <CustomButton
            btnSize="small"
            btnType="tertiary"
            btnText="Back"
            handleSubmit={() => {
              SessionStorage.removeKey("exported");
              handleNavigatePathState(MANAGE_PROJECTS_ROUTE);
            }}
          />
          <CustomButton
            btnSize="small"
            btnType="primary-light"
            btnText="Automatically All Answers"
            handleSubmit={handleFetchSheetAnswer}
          />

          <CustomButton
            btnType="primary-light"
            icon={"Download"}
            btnText={`Export Sheet`}
            btnSize={"small"}
            handleSubmit={handleExportSheet}
          />

          <CustomButton
            btnType="primary"
            btnText={`Save`}
            btnSize="small"
            handleSubmit={handleSave}
          />
        </div>
        {/* <LoadingSpinner loading={isUILoaded === false}/> */}
        {selectedSheet ? (
          <QuestionAnswersList
            data={selectedSheetData ?? []}
            onChangeSheetData={setData}
            promptPayload={{
              sheetName: selectedSheet,
              project: promptPayload,
            }}
            loading={loading}
            setIsUILoaded={isUILoaded === false ? setIsUILoaded : undefined}
          />
        ) : null}
      </AdminLayoutContentWrapper>
    </div>
  );
};

export default QuestionAnswers;
