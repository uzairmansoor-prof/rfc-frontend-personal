import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="row-justify-align-center w-screen h-screen overflow-hidden">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
