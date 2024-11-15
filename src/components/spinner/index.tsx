import { usePromiseTracker } from "react-promise-tracker";
import { SpinnerInfinity } from "spinners-react";

import "./spinner.scss";

export const LoadingSpinner = ({ loading = false }) => {
  const { promiseInProgress } = usePromiseTracker();
  return loading || promiseInProgress ? (
    <div className="loading-spinner">
      <SpinnerInfinity thickness={150} size={64} />
    </div>
  ) : null;
};
