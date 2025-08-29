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
    <div className="p-3 flex items-center gap-2 relative">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={onSend}
        placeholder="Nhập tin nhắn..."
        className="flex-1"
        suffix={
          <SmileOutlined
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            style={{ cursor: "pointer", fontSize: 20 }}
          />
        }
      />
      <div
        onClick={onSend}
        className="w-10 h-10 flex items-center justify-center text-blue-600 cursor-pointer rounded-full hover:bg-blue-100 transition-colors duration-200"
      >
        <SendOutlined />
      </div>
      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-12 right-0 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}
