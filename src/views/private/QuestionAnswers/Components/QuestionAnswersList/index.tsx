import React, { startTransition, useCallback, useState } from "react";
import QuestionAnswerComponent, {
  AnswerData,
  PromptPayloadI,
} from "../QuestionAnswerComponent";
import { isEmpty } from "@/core/utils/functions";
import CustomModal from "@/components/customModal";
import QuestionAnswerModalComponent from "../QuestionAnswerModalComponent";
import { AnswerLoadingTypo } from "../..";

interface Props {
  data: AnswerData[];
  promptPayload: PromptPayloadI;
  onChangeSheetData: React.Dispatch<
    React.SetStateAction<Record<string, AnswerData[]>>
  >;
  loading: AnswerLoadingTypo;
  setIsUILoaded?: any;
}

const QuestionAnswersList = ({
  data,
  promptPayload,
  onChangeSheetData,
  loading,
  setIsUILoaded,
}: Props) => {
  const [modalData, setModalData] = useState<AnswerData>(undefined);

  const onChangeComponentData = useCallback(
    (index: number) => (fieldName: string, value: any, additional: any) => {
      onChangeSheetData((prev) => {
        const updateData = JSON.parse(JSON.stringify(prev));
        const selectedSheetData = updateData[promptPayload.sheetName];

        updateData[promptPayload.sheetName] = selectedSheetData.map(
          (record, currIndex) => {
            return currIndex === index
              ? {
                  ...record,
                  [fieldName]: value,
                  ...(!isEmpty(additional) && {
                    ...additional,
                  }),
                }
              : record;
          },
        );
        return updateData;
      });
    },
    [promptPayload?.sheetName],
  );

  const onChangeFormData = (questionAnswer: AnswerData) => {
    setModalData(undefined);
    if (!isEmpty(questionAnswer)) {
      startTransition(() => {
        onChangeSheetData((prev) => {
          const updateData = JSON.parse(JSON.stringify(prev));
          const updateSelectedSheetData = [
            ...updateData[promptPayload.sheetName],
          ].map((record) =>
            record._id == questionAnswer._id ? questionAnswer : record,
          );
          updateData[promptPayload.sheetName] = updateSelectedSheetData;
          return updateData;
        });
      });
    }
  };

  const handleToggleModal = useCallback((event) => {
    event?.stopPropagation?.();
    setModalData(event?.target ? undefined : event);
  }, []);
  // console.log(
  //   { data, modalData, hey: promptPayload.sheetName, loading },
  //   data?.[0]?.question,
  // );

  //   useEffect(() => {
  // if(da)

  //   },[data?.length])

  // const Row = ({ index, style }) => (
  //   <div className=" ListItemOdd" style={style}>
  //     <QuestionAnswerComponent
  //       key={(index + 1).toString()}
  //       data={data?.[index]}
  //       setUILoaded={index === 0 ? setIsUILoaded : undefined}
  //       handleEdit={handleToggleModal}
  //       setData={onChangeComponentData(index)}
  //       promptPayload={promptPayload}
  //       isLoading={loading[`${index}_${promptPayload.sheetName}`] as boolean}
  //     />
  //   </div>
  // );
  // console.log("hi length", data?.length);
  return (
    <div className=" space-y-4 sheet-qa-container">
      {/* <LoadingSpinner loading /> */}
      {data.map((record, index) => (
        <QuestionAnswerComponent
          key={(index + 1).toString()}
          data={record}
          // setUILoaded={index === 0 ? setIsUILoaded : undefined}
          handleEdit={handleToggleModal}
          setData={onChangeComponentData(index)}
          promptPayload={promptPayload}
          isLoading={loading[`${index}_${promptPayload.sheetName}`] as boolean}
        />
      ))}

      {/* <AutoSizer>
        {({ height, width }) => (
          <List
            className="List"
            height={height}
            itemCount={data?.length}
            width={width}
            itemSize={() => 400}
            
          >
            {Row}
          </List>
        )}
      </AutoSizer> */}

      <CustomModal
        title={modalData?.question}
        visible={!isEmpty(modalData)}
        closeable={true}
        width={800}
        className="NewProjectModel"
        onClose={setModalData.bind({}, undefined) as any}
      >
        <QuestionAnswerModalComponent
          data={modalData}
          promptPayload={promptPayload}
          onSaveCancel={onChangeFormData}
        />
      </CustomModal>
    </div>
  );
};

export default React.memo(QuestionAnswersList);
