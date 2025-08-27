import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "../components/common/AppLayout";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import ProgressBar from "@/components/ui/ProgressBar";
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
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="antialiased">
        <Toaster position="top-right" />
        <Providers>
          <ProgressBar />
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
