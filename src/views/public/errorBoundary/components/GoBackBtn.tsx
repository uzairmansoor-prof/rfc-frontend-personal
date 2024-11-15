import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
// import { useHistory } from 'react-router-dom';

export const GoBackBtn = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(-1);
  };
  return (
    <div>
      <Button type="primary" onClick={navigateTo}>
        Back Home
      </Button>
    </div>
  );
};
