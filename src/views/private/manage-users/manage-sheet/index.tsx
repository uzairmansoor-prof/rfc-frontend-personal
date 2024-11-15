import React, { useEffect, useRef, useState } from "react";
import AdminLayoutContentWrapper from "@/components/layouts/adminLayout/adminLayoutContentWrapper";
import ListingFilterSection from "@/components/listings/listingFilterSection";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import * as XLSX from "xlsx";
import { AnswerIcon, QuestionIcon, SectionIcon } from "@/assets/img/icons";
import { Upload, Button, Dropdown, Menu, Tabs, message } from "antd"; // Import message for toast notifications
import { CaretDownOutlined, UploadOutlined } from "@ant-design/icons";
import "./style.scss";
import TabPane from "antd/es/tabs/TabPane";
import { useLocation, useNavigate } from "react-router-dom";
import { PROMPT_QUESTION_ANSWERS_ROUTE } from "@/core/constants/route-constants";
import { UserTypeBaseUrl } from "@/core/enums/user-type";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const ManageSheet = () => {
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetData, setSheetData] = useState({});
  const [activeSheet, setActiveSheet] = useState("");
  const hotTableRef = useRef(null);
  const [markedSheets, setMarkedSheets] = useState(new Set());
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const [columnMarks, setColumnMarks] = useState({}); // Current column marks
  const [taggedColumns, setTaggedColumns] = useState({}); // Store tagged column data
  const { state } = useLocation();

  const { role } = useAppSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (state?.file) {
      handleFileUpload(state?.file);
    }
  }, [state?.file]);
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(
        e.target.result as unknown as ArrayBufferLike,
      );
      const workbook = XLSX.read(data, { type: "array" });
      const sheets = workbook.SheetNames;
      setSheetNames(sheets);

      // Parse data for all sheets
      const allSheetsData = {};
      sheets.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        allSheetsData[sheetName] = jsonData;
      });

      setSheetData(allSheetsData);
      setActiveSheet(sheets[0]);
    };
    reader.readAsArrayBuffer(file);

    return false;
  };

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
      <span style={{ cursor: "pointer" }} onClick={() => setActiveSheet(sheet)}>
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

  const renderColumnDropdown = (label, index) => (
    <Menu>
      <Menu.Item
        className="section-icon"
        icon={<QuestionIcon />}
        key="1"
        onClick={() => {
          // Check if a question is already marked
          if (Object.values(columnMarks).includes("Q")) {
            message.warning("You can only mark one column as Q."); // Show warning
            return; // Exit the function
          }

          // Mark column as Question
          setColumnMarks((prev) => ({ ...prev, [index]: "Q" }));

          const headerTitle = sheetData[activeSheet][0][index]; // Get the header title
          const questionValues = sheetData[activeSheet]
            .slice(1)
            .map((row) => row[index]); // Get all values in the question column

          // Update taggedColumns state
          setTaggedColumns((prev) => {
            const existingSheetData = prev[activeSheet] || {
              sectionName: activeSheet,
              questions: [],
              answers: [],
            };

            // Check if questions array already exists
            const questionEntry = existingSheetData.questions.find(
              (q) => q.headerTitle === headerTitle,
            );

            if (questionEntry) {
              // If exists, update the questions array
              questionEntry.questions = [
                ...new Set([...questionEntry.questions, ...questionValues]),
              ]; // Avoid duplicates
            } else {
              // If not exists, create a new entry
              existingSheetData.questions.push({
                headerTitle: headerTitle,
                questions: [...new Set(questionValues)], // Avoid duplicates
              });
            }

            // Ensure answers array length matches questions
            existingSheetData.answers.forEach((answer) => {
              const lengthDiff =
                questionEntry?.questions.length - (answer.answers.length || 0);
              if (lengthDiff > 0) {
                answer.answers = [
                  ...(answer.answers || []),
                  ...Array(lengthDiff).fill(""),
                ]; // Fill with empty strings
              }
            });

            return {
              ...prev,
              [activeSheet]: existingSheetData,
            };
          });
        }}
      >
        Question
      </Menu.Item>
      <Menu.Item
        className="section-icon"
        key="2"
        icon={<AnswerIcon />}
        onClick={() => {
          // Check if an answer is already marked
          if (Object.values(columnMarks).includes("A")) {
            message.warning("You can only mark one column as A."); // Show warning
            return; // Exit the function
          }

          // Mark column as Answer
          setColumnMarks((prev) => ({ ...prev, [index]: "A" }));

          const headerTitle = sheetData[activeSheet][0][index]; // Get the header title
          const answerValues = sheetData[activeSheet]
            .slice(1)
            .map((row) => row[index]); // Get all values in the answer column

          // Update taggedColumns state
          setTaggedColumns((prev) => {
            const existingSheetData = prev[activeSheet] || {
              sectionName: activeSheet,
              questions: [],
              answers: [],
            };

            // Check if answers array already exists
            const answerEntry = existingSheetData.answers.find(
              (a) => a.headerTitle === headerTitle,
            );

            if (answerEntry) {
              // If exists, update the answers array
              answerEntry.answers = [
                ...new Set([...answerEntry.answers, ...answerValues]), // Avoid duplicates
              ];
            } else {
              // If not exists, create a new entry
              existingSheetData.answers.push({
                headerTitle: headerTitle,
                answers: [...new Set(answerValues)], // Avoid duplicates
              });
            }

            // Ensure answers array length matches questions
            existingSheetData?.questions?.forEach((question) => {
              const lengthDiff =
                question.questions.length - (answerEntry?.answers?.length || 0);
              if (lengthDiff > 0) {
                answerEntry.answers = [
                  ...(answerEntry?.answers || []),
                  ...Array(lengthDiff).fill(""), // Fill with empty strings
                ];
              }
            });

            return {
              ...prev,
              [activeSheet]: existingSheetData,
            };
          });
        }}
      >
        Answer
      </Menu.Item>
    </Menu>
  );

  const generateColumnLabels = (num) => {
    const labels = [];
    for (let i = 0; i < num; i++) {
      labels.push(String.fromCharCode(65 + i));
    }
    return labels;
  };

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

  useEffect(() => {
    // Restore marked columns when switching sheets
    const newColumnMarks = {};
    const existingSheetData = taggedColumns[activeSheet];

    if (existingSheetData) {
      // Restore marked columns based on taggedColumns
      existingSheetData.questions?.forEach((question) => {
        const headerIndex = sheetData[activeSheet][0]?.indexOf(
          question?.headerTitle,
        );
        if (headerIndex !== -1) {
          newColumnMarks[headerIndex] = "Q"; // Mark as question
        }
      });

      existingSheetData.answers.forEach((answer) => {
        const headerIndex = sheetData[activeSheet][0]?.indexOf(
          answer?.headerTitle,
        );
        if (headerIndex !== -1) {
          newColumnMarks[headerIndex] = "A"; // Mark as answer
        }
      });
    }

    setColumnMarks(newColumnMarks); // Set column marks for the current active sheet
  }, [activeSheet, taggedColumns, sheetData]);

  console.log(taggedColumns);
  return (
    <div className="grid grid-cols-[270px_1fr] h-full">
      <ListingFilterSection
        title="Sample RFP Documents"
        bottomComponent={
          <div className="gap-1">
            {sheetNames.length > 0 &&
              sheetNames.map((sheet, index) => (
                <h4 className="sheets" key={index}>
                  {sheet}
                </h4>
              ))}
          </div>
        }
      />
      <AdminLayoutContentWrapper title={null} className="sheet-wrapper">
        <div className="sheet-header">
          <div className="flex justify-between items-center py-5 px-8">
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
                  height="0px"
                  stretchH="all"
                  ref={hotTableRef}
                  licenseKey="non-commercial-and-evaluation"
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
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="btn-save"
              onClick={(event) => {
                event.preventDefault();
                navigate(
                  `${UserTypeBaseUrl[role]}${PROMPT_QUESTION_ANSWERS_ROUTE}`,
                  {
                    state: { taggedColumns },
                  },
                );
              }}
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
