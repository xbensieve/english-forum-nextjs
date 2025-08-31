"use client";

import { useEffect, useRef } from "react";
import { Message } from "./ChatPage";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {messages.map((msg, i) => {
        const isSender = msg.senderId === currentUserId;
        return (
          <div
            key={i}
            className={`flex w-full animate-slide-in ${
              isSender ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[70%] break-words shadow-sm relative ${
                isSender
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
              <div className="text-xs mt-1 text-right opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
