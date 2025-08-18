"use client";

import { Layout } from "antd";

const { Footer } = Layout;

export default function AppFooter() {
  return (
    <Footer className="bg-blue-900 text-white text-center py-4">
      <p className="text-sm sm:text-base">
        © {new Date().getFullYear()} English Forum. All rights reserved.
      </p>
    </Footer>
  );
}
