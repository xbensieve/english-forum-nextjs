"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Card, Avatar, Typography, Spin } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  senderId: string;
  text: string;
  timestamp: number;
}
interface ChatData {
  messages?: Record<string, Message>;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ChatPreview {
  chatId: string;
  partner: User;
  lastMessage: string;
  timestamp: number;
}

export default function ConversationsPage() {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const chatsRef = ref(db, "chats");
    const unsubscribe = onValue(chatsRef, async (snapshot) => {
      const data = snapshot.val() || {};
      const convs: ChatPreview[] = [];
      const promises: Promise<void>[] = [];

      Object.entries(data as Record<string, ChatData>).forEach(
        ([chatId, chat]) => {
          if (chatId.includes(userId) && chat.messages) {
            const messages: Message[] = Object.values(chat.messages);
            if (messages.length === 0) return;

            const lastMsg = messages.reduce((a, b) =>
              a.timestamp > b.timestamp ? a : b
            );

            const ids = chatId.split("_");
            const partnerId = ids.find((id) => id !== userId) || "Unknown";

            const p = axios
              .get<User>(`/api/users/${partnerId}/detail`)
              .then((res) => {
                convs.push({
                  chatId,
                  partner: res.data,
                  lastMessage: lastMsg.text,
                  timestamp: lastMsg.timestamp,
                });
              })
              .catch((err) => {
                console.error("Failed to fetch partner:", err);
              });

            promises.push(p);
          }
        }
      );

      await Promise.all(promises);
      convs.sort((a, b) => b.timestamp - a.timestamp);
      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  if (status === "loading") return <Spin fullscreen />;

  if (!session?.user)
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="p-8 flex flex-col items-center gap-4">
          <Typography.Text type="secondary" className="text-lg">
            Please log in to continue
          </Typography.Text>
          <Link
            href="/login"
            className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );

  const handleOpenChat = (partnerId: string) => {
    if (!partnerId) return;
    const encodedId = btoa(partnerId);
    router.push(`/chat/${encodedId}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4">
      <Typography.Title level={3} className="!mb-4">
        Trò chuyện
      </Typography.Title>

      <div className="flex flex-col divide-y rounded-lg bg-white max-h-[600px] overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv.chatId}
              onClick={() => handleOpenChat(conv.partner._id)}
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <Avatar size={48} src={conv.partner.avatar}>
                {conv.partner.name?.[0]}
              </Avatar>

              <div className="flex flex-col flex-1 min-w-0">
                <Typography.Text strong className="truncate">
                  {conv.partner.name}
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  ellipsis={{ tooltip: conv.lastMessage }}
                  className="truncate"
                >
                  {conv.lastMessage || "Chưa có tin nhắn"}
                </Typography.Text>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Chưa có cuộc trò chuyện nào
          </div>
        )}
      </div>
    </div>
  );
}
