"use client";

import { Layout } from "antd";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const { Content } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />

      <Content className="flex-1 mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {children}
      </Content>

      <AppFooter />
    </Layout>
  );
}
