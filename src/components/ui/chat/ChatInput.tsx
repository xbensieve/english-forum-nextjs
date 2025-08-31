"use client";

import { Input } from "antd";
import { SmileOutlined, SendOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useRef } from "react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface ChatInputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onSend: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  showEmojiPicker,
  setShowEmojiPicker,
}: ChatInputProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-2">
      {/* Input */}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={onSend}
        placeholder="Nhập tin nhắn..."
        className="rounded-full px-4 py-2"
        suffix={
          <SmileOutlined
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            style={{ cursor: "pointer", fontSize: 20 }}
          />
        }
      />

      {/* Send button */}
      <div
        onClick={onSend}
        className="w-10 h-10 flex items-center justify-center text-blue-600 cursor-pointer rounded-full hover:bg-blue-100 transition-colors duration-200"
      >
        <SendOutlined />
      </div>

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-14 right-4 z-10 shadow-lg"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}
