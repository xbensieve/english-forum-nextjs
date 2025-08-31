"use client";

import { Dispatch, SetStateAction } from "react";

import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { Message } from "./ChatPage";

interface ChatContainerProps {
  messages: Message[];
  currentUserId: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onSend: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
}

export default function ChatContainer({
  messages,
  currentUserId,
  input,
  setInput,
  onSend,
  showEmojiPicker,
  setShowEmojiPicker,
}: ChatContainerProps) {
  return (
    <div className="w-full h-[560px] flex flex-col bg-gray-50 rounded-2xl">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      <div className="sticky bottom-0 bg-white">
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={onSend}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
        />
      </div>
    </div>
  );
}
