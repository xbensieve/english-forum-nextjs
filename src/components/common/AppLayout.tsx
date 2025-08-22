"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Layout } from "antd";
import AppHeader from "./AppHeader";
import Loading from "../ui/Loading";
import Sidebar from "../ui/Sidebar";

const { Content } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return <Loading />;

  if (pathname === "/login") return <>{children}</>;

  return (
    <Layout className="min-h-screen">
      <AppHeader />
      <Layout hasSider>
        <Sidebar />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}
