import { Popover, Progress } from "antd";
import React from "react";
import "./styles.scss";

const ProgressBar = ({ data, answerScore }) => {
  const content = (
    <div className="contentContainer">
      {/* Check if data is an array and has content */}
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <p className="text-black">
              <strong className="text-black font-bold">Question:</strong>{" "}
              {item.Question}
            </p>
            <p className="text-black">
              <strong className="text-black font-bold">Answer:</strong>{" "}
              {item.Answer}
            </p>
            <p className="text-black">
              <strong className="text-black font-bold">Score:</strong>{" "}
              {item.Score?.toFixed(2)}
            </p>
            {index < data?.length - 1 && <hr />}
          </div>
        ))
      ) : (
        <p>No data available</p> // Fallback message if data is empty or not an array
      )}
    </div>
  );
  const percentageProgress = (percentage) => {
    // console.log(percentage * 100, "pppppp");
    return percentage * 100;
  };

  return (
    <div>
      {/* Conditionally render Popover only if data is not undefined */}
      {data ? (
        <div className="cursor-pointer">
          <Popover
            placement="topRight"
            content={content}
            trigger="click"
            overlayClassName="custom-popover"
            // overlayClassName="bg-primary text-white"
          >
            <Progress
              type="circle"
              percent={percentageProgress(answerScore)}
              gapDegree={30}
              size={40}
              status="normal"
              format={(percent) => `${percent}%`} // Shows the percentage instead of checkmark
              strokeColor={"#054499"}
            />
          </Popover>
        </div>
      ) : (
        // If data is undefined, show a Progress without Popover or handle as needed
        <div className="cursor-default">
          <Progress
            type="circle"
            percent={percentageProgress(answerScore)}
            gapDegree={30}
            size={40}
            status="normal"
            format={(percent) => `${percent}%`}
          />
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
