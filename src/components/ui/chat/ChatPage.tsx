"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Spin, Typography } from "antd";
import Link from "next/link";
import axios from "axios";
import ChatContainer from "./ChatContainer";
import UserInfoCard from "./UserInfoCard";
import { sendMessage, listenMessages } from "@/lib/chatService";

const { Text } = Typography;

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  senderId: string;
  text: string;
  timestamp: number;
}

interface ChatPageProps {
  userId: string;
}

export default function ChatPage({ userId }: ChatPageProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    try {
      const realId = atob(userId);
      axios
        .get<User>(`/api/users/${realId}/detail`)
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!session?.user?.id || !user?._id) return;
    const chatId = [session.user.id, user._id].sort().join("_");
    listenMessages(chatId, setMessages);
  }, [session?.user?.id, user?._id]);

  const handleSend = async () => {
    if (!input.trim() || !session?.user?.id || !user?._id) return;
    const chatId = [session.user.id, user._id].sort().join("_");
    await sendMessage(chatId, session.user.id, input.trim());
    setInput("");
  };

  if (!session?.user) {
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
  }

  if (loading) return <Spin fullscreen />;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <p className="text-lg font-medium">User not found</p>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl gap-3">
        <div className="w-full md:w-3/4 flex">
          <ChatContainer
            messages={messages}
            currentUserId={session.user.id}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
          />
        </div>
        <div className="hidden md:flex w-1/4">
          <UserInfoCard user={user} />
        </div>
      </div>
    </div>
  );
}
