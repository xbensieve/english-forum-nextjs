"use client";

import { Layout, Menu, Button, Drawer, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

export default function AppHeader() {
  const [current, setCurrent] = useState("home");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const items = [
    { key: "home", label: <Link href="/">Home</Link> },
    { key: "profile", label: <Link href="/profile">Profile</Link> },
    { key: "post", label: <Link href="/post">Post</Link> },
  ];

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Header className="flex items-center justify-between px-6 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
      <Title level={4} className="!text-white !m-0 !font-semibold">
        English Forum
      </Title>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[current]}
        onClick={(e) => setCurrent(e.key)}
        items={items}
        className="hidden md:flex flex-1 justify-end bg-transparent border-none"
        style={{ lineHeight: "64px" }}
      />

      <Button
        type="text"
        icon={<MenuOutlined className="text-white text-lg" />}
        onClick={toggleDrawer}
        className="md:hidden"
      />

      <Drawer
        title="Menu"
        placement="right"
        onClose={toggleDrawer}
        open={drawerVisible}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[current]}
          onClick={(e) => {
            setCurrent(e.key);
            setDrawerVisible(false);
          }}
          items={items}
        />
      </Drawer>
    </Header>
  );
}
