import { Layout } from "antd";
import React from "react";
import CustomHeader from "./customHeader";
import CustomSideBar from "./customSideBar";
import { Outlet } from "react-router-dom";
import { SocketContexttProvider } from "@/core/context/socketContext";
const { Content } = Layout;

const AdminLayout = () => {
  return (
    <SocketContexttProvider>
      <Layout className=" bg-layout  min-h-screen">
        <CustomHeader />
        <Layout className="bg-inherit">
          <CustomSideBar />
          <Content className={`bg-white rounded-layout`}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </SocketContexttProvider>
  );
};

export default AdminLayout;
