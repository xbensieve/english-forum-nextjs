"use client";

import { Typography } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ChatPage from "@/components/ui/chat/ChatPage";

const { Text } = Typography;

export default function Page() {
  const { userId } = useParams<{ userId: string }>();
  const { data: session } = useSession();

  if (!session?.user)
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="p-8 flex flex-col items-center gap-4">
          <Text type="secondary" className="text-lg">
            Please log in to continue
          </Text>
          <Link
            href="/login"
            className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );

  return <ChatPage userId={userId} />;
}
