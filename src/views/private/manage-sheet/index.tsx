import React, { useEffect, useRef, useState } from "react";
import AdminLayoutContentWrapper from "@/components/layouts/adminLayout/adminLayoutContentWrapper";
import { HotTable, HotTableClass } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import * as XLSX from "xlsx";
import { AnswerIcon, QuestionIcon, SectionIcon } from "@/assets/img/icons";
import { Upload, Button, Dropdown, Menu, Tabs, message } from "antd"; // Import message for toast notifications
import { CaretDownOutlined, UploadOutlined } from "@ant-design/icons";
import "./style.scss";
import TabPane from "antd/es/tabs/TabPane";
import { useLocation } from "react-router-dom";
import {
  MANAGE_PROJECTS_ROUTE,
  PROMPT_QUESTION_ANSWERS_ROUTE,
} from "@/core/constants/route-constants";
import { UseNavigateStateParams } from "@/core/hooks/useNavigateServerParams";
import axios from "axios";
import { API_BASE_PATH } from "@/core/constants/env-constants";
import { isEmpty } from "@/core/utils/functions";
import { removeSpecificDuplicates } from "@/core/utils/array-utils";
import axiosInstance from "@/core/api";

const ManageSheet = () => {
  const [sheetNames, setSheetNames] = useState([]);
  const [file, setFile] = useState(undefined);
  const [sheetData, setSheetData] = useState({});
  const [activeSheet, setActiveSheet] = useState("");
  const hotTableRef = useRef<HotTableClass>(null);
  const [markedSheets, setMarkedSheets] = useState(new Set());
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const [columnMarks, setColumnMarks] = useState({}); // Current column marks
  const [taggedColumns, setTaggedColumns] = useState({}); // Store tagged column data
  const { state } = useLocation();
  const { handleNavigatePathState } = UseNavigateStateParams();

  const [answerTitleIndex, setAnswerTitleIndex] = useState({});
  const [rowStartIndex, setRowStartIndex] = useState({});

  useEffect(() => {
    if (state?.file) {
      handleFileUpload(state?.file);
    }
  }, [state?.file]);

  //project listing file uploaded but not have que save, navigate here, load file and convert to file object
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(
          `/projects/files/${state?.project?.rfpFile}`,
        );

        const fileObject = new File([response.data], "fileName.xlsx");

        handleFileUpload(fileObject);
      } catch (error) {
        console.error("Error downloading CSV:", error);
        // Handle error appropriately, e.g., show an error message
      }
    })();
  }, [state?.project]);
  console.log({ answerTitleIndex, rowStartIndex, sheetData, taggedColumns });
  console.log(state?.file, "file", state?.project);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Update window height on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(
        window.innerWidth < 875 ? window.innerHeight - 25 : window.innerHeight,
      ); // Update window height
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const padArray = (list, count) => {
    return Array.from({ length: count }, (_, index) => {
      if (index >= list.length) {
        return null;
      }
      return list[index];
    });
  };
  const handleFileUpload = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result as unknown as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheets = workbook.SheetNames;
      setSheetNames(sheets);

      // Parse data for all sheets
      const allSheetsData = {};
      sheets.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        // Check if the range starts from A1
        if (worksheet["!ref"] && !worksheet["!ref"].startsWith("A1")) {
          // Get the current range (e.g., "B2:G41")
          const currentRange = worksheet["!ref"];

          // Find the part of the range that is not A1 (e.g., "B2:G41")
          const newRange = currentRange.replace(/^([A-Z]+)(\d+)/, "A1"); // Replace the first part of the range with A1

          // Update the range to include A1 while keeping the rest of the range the same
          worksheet["!ref"] = newRange;
        }

        // Detect merged cells
        const merges = worksheet["!merges"] || []; // List of merged cell ranges
        console.log("Merged Cells:", merges); // Log the merged cell

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log({ jsonData, worksheet });

        const maximumColumnCount = Math.max(
          ...jsonData.map((rowData) => (rowData as any[]).length),
        );
        console.log({ maximumColumnCount });
        const mapJSONData = jsonData.map((row) =>
          padArray(row, maximumColumnCount),
        );
        console.log({ mapJSONData });
        allSheetsData[sheetName] = mapJSONData;
      });

      setSheetData(allSheetsData);
      setActiveSheet(sheets[0]);
    };
    reader.readAsArrayBuffer(file);

    return false;
  };

  // console.log({ sheetData, columnMarks, taggedColumns, activeSheet });

  // Menu for each tab dropdown
  const renderDropdownMenu = (sheet) => (
    <Menu>
      <Menu.Item
        key="1"
        className="section-icon"
        icon={<SectionIcon />}
        onClick={() => {
          const updatedSheets = new Set(markedSheets);
          if (updatedSheets.has(sheet)) {
            updatedSheets.delete(sheet);
          } else {
            updatedSheets.add(sheet);
          }
          setMarkedSheets(updatedSheets);
        }}
      >
        Section
      </Menu.Item>
    </Menu>
  );

  // Render a Tab title with dropdown for the DownOutlined icon
  const renderTabTitle = (sheet) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <p className={`${markedSheets.has(sheet) ? "marked-sheets" : ""}`}>
        {markedSheets.has(sheet) && " S"} {/* Display "(S)" if marked */}
      </p>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          setActiveSheet(sheet);
        }}
      >
        {sheet}
      </span>
      <Dropdown
        overlay={renderDropdownMenu(sheet)}
        trigger={["click"]}
        placement="top"
      >
        <CaretDownOutlined style={{ marginLeft: 8, cursor: "pointer" }} />
      </Dropdown>
    </div>
  );

  console.log({ columnMarks });

  const renderColumnDropdown = (label, index) => {
    const isCurrentColumnQuestionMarked = columnMarks[index] === "Q";
    const isCurrentColumnAnswerMarked = columnMarks[index] === "A";

    return (
      <Menu>
        <Menu.Item
          className="section-icon"
          icon={<QuestionIcon />}
          key="1"
          onClick={() => {
            console.log("ques", isCurrentColumnQuestionMarked, index);
            // If already marked as Question, clicking again will unmark it
            if (isCurrentColumnQuestionMarked) {
              setColumnMarks((prev) => ({
                ...prev,
                [index]: null, // Remove the "Q" mark
              }));

              // Remove the question entry from tagged columns
              setTaggedColumns((prev) => {
                console.log({ prev, sheetData });
                const updatedSheetData = { ...prev[activeSheet] };
                updatedSheetData.questions = [];
                console.log({ updatedSheetData });
                return { ...prev, [activeSheet]: updatedSheetData };
              });
              return;
            }

            // // Check if another column is already marked as Question
            if (isCurrentColumnAnswerMarked) {
              message.warning("Column marked already as Answer Column.");
              return;
            }

            // Mark as Question
            setColumnMarks((prev) => ({
              ...prev,
              [index]: "Q",
            }));
            // setQuestionTitleIndex((prev) => ({
            //   ...prev,
            //   [activeSheet]: index,
            // }));

            const headerTitle = sheetData[activeSheet][0][index];
            const questionValues = sheetData[activeSheet]
              .slice(1)
              .map((row) => row[index]);

            setTaggedColumns((prev) => {
              console.log({ prev });
              const updatePrev = JSON.parse(JSON.stringify(prev));
              const existingSheetData = updatePrev[activeSheet] || {
                sectionName: activeSheet,
                questions: [],
                answers: [],
              };

              existingSheetData.questions = [
                {
                  headerTitle,
                  headerColumnIndex: index,
                  questions: [...removeSpecificDuplicates(questionValues)],
                },
              ];

              return { ...updatePrev, [activeSheet]: existingSheetData };
            });
          }}
        >
          {isCurrentColumnQuestionMarked ? "Question (Q)" : "Question"}
        </Menu.Item>

        <Menu.Item
          className="section-icon"
          key="2"
          icon={<AnswerIcon />}
          onClick={() => {
            // If already marked as Answer, clicking again will unmark it
            if (isCurrentColumnAnswerMarked) {
              setColumnMarks((prev) => ({
                ...prev,
                [index]: null, // Remove the "A" mark
              }));

              // Remove the answer entry from tagged columns
              setTaggedColumns((prev) => {
                const updatedSheetData = { ...prev[activeSheet] };
                updatedSheetData.answers = [];
                // updatedSheetData.answers.filter(
                //   (a) => a.headerTitle !== sheetData[activeSheet][0][index],
                // );
                return { ...prev, [activeSheet]: updatedSheetData };
              });
              return;
            }

            // Check if another column is already marked as Answer
            if (isCurrentColumnQuestionMarked) {
              message.warning("Column marked already as Question Column.");
              return;
            }

            // Mark as Answer
            setColumnMarks((prev) => ({
              ...prev,
              [index]: "A",
            }));
            setAnswerTitleIndex((prev) => ({ ...prev, [activeSheet]: index }));

            const headerTitle = sheetData[activeSheet][0][index];
            const answerValues = sheetData[activeSheet]
              .slice(1)
              .map((row) => row[index]);

            console.log({ answerValues, hey: sheetData[activeSheet], index });

            setTaggedColumns((prev) => {
              console.log("answe", prev);
              const updatePrev = JSON.parse(JSON.stringify(prev));

              const existingSheetData = updatePrev[activeSheet] || {
                sectionName: activeSheet,
                questions: [],
                answers: [],
              };

              existingSheetData.answers = [
                {
                  headerTitle,
                  headerColumnIndex: index,
                  answers: answerValues,
                },
              ];

              return { ...updatePrev, [activeSheet]: existingSheetData };
            });
          }}
        >
          {isCurrentColumnAnswerMarked ? "Answer (A)" : "Answer"}
        </Menu.Item>
      </Menu>
    );
  };

  const generateColumnLabels = (num) => {
    const labels = [];
    for (let i = 0; i < num; i++) {
      labels.push(String.fromCharCode(65 + i));
    }
    return labels;
  };

  console.log({ columnMarks, taggedColumns });
  // Render column labels with dropdowns
  const renderColumnLabels = () => {
    if (activeSheet && sheetData[activeSheet]) {
      const numColumns = sheetData[activeSheet][0].length;
      const columnLabels = generateColumnLabels(numColumns);

      return columnLabels.map((label, index) => (
        <div
          key={index}
          className="flex items-center grow pr-1 justify-end col-header-dropdown"
        >
          <Dropdown
            overlay={renderColumnDropdown(label, index)}
            trigger={["click"]}
            open={visibleDropdownIndex === index}
            placement="bottomRight"
            onOpenChange={(visible) => {
              setVisibleDropdownIndex(visible ? index : null);
            }}
          >
            <span
              className="cursor-pointer flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setVisibleDropdownIndex(
                  visibleDropdownIndex === index ? null : index,
                );
              }}
            >
              <p
                className={`${columnMarks[index] && "tagged-header"}`}
                data-mark={columnMarks[index]}
              >
                {columnMarks[index] && `${columnMarks[index]}`}
              </p>

              <CaretDownOutlined className="header-dropdown-icon" />
            </span>
          </Dropdown>
        </div>
      ));
    }
    return null;
  };
  // console.log("state", state?.project);

  useEffect(() => {
    // Restore marked columns when switching sheets
    const newColumnMarks = {};
    const existingSheetData = taggedColumns[activeSheet];

    if (existingSheetData) {
      // Restore marked columns based on taggedColumns

      const questionHeaderIndex =
        existingSheetData.questions?.[0]?.headerColumnIndex;
      if (!isEmpty(questionHeaderIndex))
        newColumnMarks[questionHeaderIndex] = "Q";

      const answerHeaderIndex =
        existingSheetData.answers?.[0]?.headerColumnIndex;
      if (!isEmpty(answerHeaderIndex)) newColumnMarks[answerHeaderIndex] = "A";
    }

    setColumnMarks(newColumnMarks); // Set column marks for the current active sheet
  }, [activeSheet, taggedColumns, sheetData]);

  useEffect(() => {
    activeSheet &&
      hotTableRef.current?.hotInstance?.selectRows(rowStartIndex[activeSheet]);
  }, [activeSheet]);

  // console.log(taggedColumns);

  // console.log({ file });
  const handlefileSave = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("projectId", state?.project._id);
    payload.append("file", state?.file ?? file);
    const response = await axios.post(
      `${API_BASE_PATH}/projects/upload-rfp`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );
    // console.log({ response });

    handleNavigatePathState(PROMPT_QUESTION_ANSWERS_ROUTE, {
      taggedColumns,
      project: state?.project,
      answerTitleIndex,
      rowStartIndex,
    });
  };

  return (
    <div className="w-full h-full">
      <AdminLayoutContentWrapper title={null} className="sheet-wrapper">
        <div className="sheet-header">
          <div className="flex justify-between items-center pt-5  pb-2 px-8">
            <span className="text-base font-[500]">
              Tag each column to designate its functionality
            </span>

            <Upload
              accept=".xlsx, .xls, .csv"
              beforeUpload={handleFileUpload}
              showUploadList={false}
            >
              <Button
                type="primary"
                className="btn-import"
                icon={<UploadOutlined />}
              >
                Import File
              </Button>
            </Upload>
          </div>
          <div className=" pl-8  text-base text-yellow-500 font-[500] italic">
            Select a row to start question-answer tagging; otherwise, tagging
            will begin from the first row.
          </div>

          <div>
            {activeSheet && sheetData[activeSheet] && (
              <>
                <div className="column-headers">{renderColumnLabels()}</div>
                <HotTable
                  data={sheetData[activeSheet]}
                  colHeaders={true}
                  rowHeaders={true}
                  dragToScroll={true}
                  width="100%"
                  height={windowHeight - 300}
                  stretchH="all"
                  ref={hotTableRef}
                  licenseKey="non-commercial-and-evaluation"
                  afterSelectRows={(event, coords, td) => {
                    const rowIndex = coords.row; // Get the row index of the clicked cell
                    setRowStartIndex((prev) => ({
                      ...prev,
                      [activeSheet]: rowIndex,
                    }));
                  }}
                />
              </>
            )}
            {sheetNames.length > 0 && (
              <Tabs
                className="sheet-tabs"
                onChange={(key) => {
                  setActiveSheet(key);
                  setColumnMarks({}); // Clear column marks when switching sheets
                }}
                activeKey={activeSheet}
                style={{ marginTop: 16 }}
              >
                {sheetNames.map((sheet) => (
                  <TabPane tab={renderTabTitle(sheet)} key={sheet}></TabPane>
                ))}
              </Tabs>
            )}
          </div>
          <div className="action-btns">
            <Button
              type="primary"
              className="btn-cancel"
              onClick={() => {
                setSheetNames([]); // Clear sheet names
                setSheetData({}); // Reset sheet data to empty object
                setActiveSheet(""); // Reset active sheet
                setColumnMarks({}); // Clear column marks
                setTaggedColumns({});
                handleNavigatePathState(MANAGE_PROJECTS_ROUTE);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="btn-save"
              onClick={handlefileSave}
            >
              Save
            </Button>
          </div>
        </div>
      </AdminLayoutContentWrapper>
    </div>
  );
};

export default ManageSheet;
