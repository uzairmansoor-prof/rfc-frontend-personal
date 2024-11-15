import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate(-1);
  };
  return (
    <div className="w-full h-full col-justify-align-center gap-y-8">
      <h1>Coming Soon...</h1>
      <Button
        type="primary"
        size="large"
        className="w-20"
        onClick={handleLogout}
      >
        Back
      </Button>
    </div>
  );
};

export default NotFound;
