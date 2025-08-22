import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "../components/common/AppLayout";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "English Forum",
  description: "A place to share and learn English knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
