"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Card, Avatar, Typography, Spin } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

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

  if (status === "loading" || loading) return <Spin />;
  if (!session?.user) return <div>Please log in</div>;

  const handleOpenChat = (partnerId: string) => {
    if (!partnerId) return;
    const encodedId = btoa(partnerId);
    router.push(`/chat/${encodedId}`);
  };

  return (
    <div className="w-full md:w-2/3 mx-auto p-4">
      <Typography.Title level={3}>Your Conversations</Typography.Title>
      {conversations.map((conv) => (
        <Card
          key={conv.chatId}
          className="mb-3 flex flex-row items-center cursor-pointer hover:shadow-md transition"
          onClick={() => handleOpenChat(conv.partner._id)}
        >
          <Avatar src={conv.partner.avatar}>{conv.partner.name?.[0]}</Avatar>
          <div className="ml-3 flex flex-col">
            <Typography.Text strong>{conv.partner.name}</Typography.Text>
            <Typography.Text
              type="secondary"
              ellipsis={{ tooltip: conv.lastMessage }}
            >
              {conv.lastMessage}
            </Typography.Text>
          </div>
        </Card>
      ))}
    </div>
  );
}
