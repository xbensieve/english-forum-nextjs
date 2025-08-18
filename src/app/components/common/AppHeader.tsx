"use client";

import { Layout, Menu } from "antd";
import Link from "next/link";
import { useState } from "react";

const { Header } = Layout;

export default function AppHeader() {
  const [current, setCurrent] = useState("home");

  const items = [
    { key: "home", label: <Link href="/">Home</Link> },
    { key: "profile", label: <Link href="/profile">Profile</Link> },
    { key: "post", label: <Link href="/post">Post</Link> },
  ];

  return (
    <Header className="bg-blue-600 px-3 sm:px-6">
      <div className="flex items-center justify-between h-full">
        <div className="text-white font-bold text-lg sm:text-xl">
          English Forum
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[current]}
          onClick={(e) => setCurrent(e.key)}
          items={items}
          className="bg-blue-600 flex-1 justify-end"
        />
      </div>
    </Header>
  );
}
