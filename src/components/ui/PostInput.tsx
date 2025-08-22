"use client";
import React, { useState } from "react";
import { Avatar, Input, Button, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

interface PostInputProps {
  session: { user?: { name?: string; image?: string } };
  onClose: () => void;
  onSubmit: (content: string) => void;
}
export default function PostInput({
  session,
  onClose,
  onSubmit,
}: PostInputProps) {
  const { user } = session;
  const [postContent, setPostContent] = useState("");

  const handlePost = () => {
    if (!postContent.trim()) return;
    onSubmit(postContent);
    setPostContent("");
    onClose();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Create post</h2>
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          size={48}
          src={user?.image}
          icon={!user?.image && <UserOutlined />}
        />
        <span className="font-medium text-gray-800">
          {user?.name || "Guest"}
        </span>
      </div>
      <Input.TextArea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder={`What's on your mind, ${user?.name || "Guest"}?`}
        autoSize={{ minRows: 3, maxRows: 6 }}
        className="rounded-xl"
      />
      <div className="mt-4">
        <Upload>
          <Button icon={<UploadOutlined />}>Add Image</Button>
        </Upload>
      </div>
      <div className="mt-4">
        <Button
          type="primary"
          block
          className="rounded-full"
          onClick={handlePost}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
