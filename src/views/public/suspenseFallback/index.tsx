import React from "react";
import { SpinnerInfinity } from "spinners-react";

const SuspenseFallback = () => {
  return (
    <div className="suspense-fallback-container">
      <div className="loading-spinner" style={{ top: "0px", left: "0px" }}>
        <SpinnerInfinity thickness={150} size={64} />
      </div>
    </div>
  );
};

export default SuspenseFallback;
