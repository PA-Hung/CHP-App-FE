import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Layout, ConfigProvider, Menu, notification, theme } from "antd";
import {
  HomeOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
  CalendarOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import Logo from "@/components/admin/logo.jsx";
import ToggleThemeButton from "@/components/admin/toggleTheme.jsx";
import { postLogOut } from "@/utils/api.js";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutAction } from "@/redux/slice/authSlice.js";
import HeaderAdmin from "@/components/admin/header.jsx";
import { setActiveKey, setHomeKey } from "@/redux/slice/menuSilce.js";
import { setThemeMode } from "../redux/slice/themeSilce";

const { Footer, Sider, Content } = Layout;

const LayoutAdmin = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.user.role);
  const activeMenu = useSelector((state) => state.menu.activeKey);
  const themeMode = useSelector((state) => state.theme.themeMode);
  const darkConfig = { algorithm: theme.darkAlgorithm };
  const lightConfig = { algorithm: theme.defaultAlgorithm };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleTheme = () => {
    if (themeMode === "light") {
      dispatch(setThemeMode("dark"));
    } else {
      dispatch(setThemeMode("light"));
    }
  };

  const handleMenu = (e) => {
    if (e.key === "home") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Bảng đăng ký sản xuất tiền kỳ chuyên mục tuần",
        })
      );
    }
    if (e.key === "user") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Quản lý người dùng",
        })
      );
    }
    if (e.key === "accommodation") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Quản lý thông tin lưu trú",
        })
      );
    }
    if (e.key === "usertasklist") {
      dispatch(
        setActiveKey({
          activeKey: e.key,
          title: "Danh sách đăng ký",
        })
      );
    }
  };

  const handleLogout = async () => {
    const res = await postLogOut();
    if (res && res.data) {
      dispatch(setLogoutAction({}));
      dispatch(setHomeKey());
      notification.success({
        message: "Đăng xuất thành công !",
      });
      navigate("/");
    }
  };

  const items = [
    {
      label: <Link to={"/admin"}>Trang chủ</Link>,
      key: "home",
      icon: <HomeOutlined />,
      visible: "true",
    },
    {
      label: <Link to={"/admin/accommodation"}>Quản lý lưu trú</Link>,
      key: "accommodation",
      icon: <CalendarOutlined />,
      visible: isAdmin === "ADMIN" ? "true" : "false",
    },
    {
      label: <Link to={"/admin/user"}>Quản lý người dùng</Link>,
      key: "user",
      icon: <UserSwitchOutlined />,
      visible: isAdmin === "ADMIN" ? "true" : "false",
    },

    {
      label: <Link onClick={() => handleLogout()}>Đăng xuất</Link>,
      key: "logout",
      icon: <LogoutOutlined />,
      visible: "true",
    },
  ];

  const filteredItems = items.filter((item) => item.visible === "true");

  return (
    <ConfigProvider theme={themeMode === "dark" ? darkConfig : lightConfig}>
      <Layout hasSider style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          mode="inline"
          style={{
            overflow: "hidden",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div>
            <Logo />
            <Menu
              onClick={handleMenu}
              style={{ height: "100vh" }}
              mode="vertical"
              items={filteredItems}
              defaultSelectedKeys={["home"]}
              selectedKeys={activeMenu}
            />
            <ToggleThemeButton toggleTheme={toggleTheme} />
          </div>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? "80px" : "200px" }}>
          <HeaderAdmin
            toggleCollapsed={toggleCollapsed}
            collapsed={collapsed}
          />
          <Content
            style={{
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <div
              style={{
                minHeight: "100%",
                background:
                  themeMode === "light" ? colorBgContainer : "#141414",
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            BRT APP ©2023 Created by Phan Anh Hùng
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutAdmin;
