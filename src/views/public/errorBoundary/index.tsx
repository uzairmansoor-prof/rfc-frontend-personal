import { Result } from "antd";
import React from "react";
import { GoBackBtn } from "./components/GoBackBtn";

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false as any };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex justify-center items-center w-full">
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={<GoBackBtn />}
            className="error-boundary-content"
          />
        </div>
      );
    } else return (this.props as any).children;
  }
}
export default ErrorBoundary;
