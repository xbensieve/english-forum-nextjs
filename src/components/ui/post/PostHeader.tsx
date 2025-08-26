"use client";
import { Avatar } from "antd";

interface PostHeaderProps {
  avatar?: string;
  userName: string;
  createdAt: string;
}

export default function PostHeader({
  avatar,
  userName,
  createdAt,
}: PostHeaderProps) {
  return (
    <div className="flex items-center mb-3">
      <Avatar size={40} src={avatar} />
      <div className="ml-3">
        <div className="font-semibold">{userName}</div>
        <div className="text-xs text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
