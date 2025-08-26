"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, Input, Button, Tooltip } from "antd";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export default function CommentBox({
  image,
  onSubmitAction,
}: {
  image: string;
  onSubmitAction: (text: string) => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onSubmitAction(commentText);
    setCommentText("");
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setCommentText((prev) => prev + emoji.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };

    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji]);

  return (
    <div className="flex items-start gap-3 mb-4 relative">
      <Avatar size={36} src={image} />

      <div className="relative flex-1">
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
          className="rounded-3xl pr-20 pl-4 py-2 border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all resize-none"
        />

        <Tooltip title="Emoji">
          <Button
            type="text"
            size="small"
            shape="circle"
            icon={
              <SmileOutlined className="text-gray-500 hover:text-yellow-500 transition-colors" />
            }
            onClick={() => setShowEmoji((prev) => !prev)}
            className="!absolute right-10 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
          />
        </Tooltip>

        <Tooltip title="Send">
          <Button
            type="text"
            size="small"
            shape="circle"
            disabled={!commentText.trim()}
            icon={
              <SendOutlined
                className={
                  commentText.trim() ? "text-blue-500" : "text-gray-400"
                }
              />
            }
            onClick={handleAddComment}
            className="!absolute right-2 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
          />
        </Tooltip>
      </div>

      {showEmoji && (
        <div
          ref={emojiRef}
          className="absolute bottom-12 left-12 z-50 shadow-lg rounded-xl overflow-hidden"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}
