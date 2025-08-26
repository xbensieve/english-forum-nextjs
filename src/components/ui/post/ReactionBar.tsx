"use client";
import { Button } from "antd";
import { LikeOutlined, LikeFilled, CommentOutlined } from "@ant-design/icons";

interface ReactionBarProps {
  liked: boolean;
  onToggleLike: () => void;
}

export default function ReactionBar({ liked, onToggleLike }: ReactionBarProps) {
  return (
    <div className="flex justify-around mb-2">
      <Button
        type="text"
        icon={
          liked ? <LikeFilled className="text-blue-500" /> : <LikeOutlined />
        }
        onClick={onToggleLike}
        className={`flex-1 font-medium ${
          liked ? "text-blue-500" : "text-gray-700"
        }`}
      >
        {liked ? "Liked" : "Like"}
      </Button>
      <Button type="text" icon={<CommentOutlined />} className="flex-1">
        Comment
      </Button>
    </div>
  );
}
