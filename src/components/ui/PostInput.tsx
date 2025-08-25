"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Avatar, Input, Button, Popconfirm } from "antd";
import {
  DeleteOutlined,
  LoadingOutlined,
  SmileOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import axios from "axios";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
interface PostInputProps {
  session: { user?: { name?: string; image?: string } };
  onClose: () => void;
  onSubmit: (content: string, imageUrls: string[]) => void;
}
export default function PostInput({
  session,
  onClose,
  onSubmit,
}: PostInputProps) {
  const { user } = session;
  const [postContent, setPostContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [images, setImages] = useState<{ url: string; public_id: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const handlePost = () => {
    if (!postContent.trim() && images.length === 0) return;
    onSubmit(
      postContent,
      images.map((img) => img.url)
    );
    setPostContent("");
    setImages([]);
    onClose();
  };
  const handleDeleteImage = async (public_id: string, index: number) => {
    try {
      await axios.delete("/api/delete-image", {
        data: { public_id },
      });
      setImages((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tạo bài viết</h2>
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          size={48}
          src={user?.image}
          icon={!user?.image && <UserOutlined />}
        />
        <span className="font-medium text-gray-800">
          {user?.name || "Khách"}
        </span>
      </div>
      <Input.TextArea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder={`Bạn đang nghĩ gì, ${user?.name || "Khách"}?`}
        autoSize={{ minRows: 3, maxRows: 6 }}
        className="rounded-xl"
        onFocus={(e) => {
          setTimeout(() => {
            e.target.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 300);
        }}
      />
      <div className="mt-4 flex items-center gap-3">
        <CldUploadButton
          className="ant-btn ant-btn-default flex items-center gap-2 cursor-pointer hover:opacity-80 transition duration-200"
          uploadPreset="next_unsigned"
          options={{ resourceType: "image" }}
          onUploadAdded={() => setLoading(true)}
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            // Type guard to ensure info is defined, an object, and has required properties
            if (
              result?.info &&
              typeof result.info === "object" &&
              "secure_url" in result.info &&
              typeof result.info.secure_url === "string" &&
              "public_id" in result.info &&
              typeof result.info.public_id === "string"
            ) {
              const info = result.info as {
                secure_url: string;
                public_id: string;
              };
              setImages((prev) => [
                ...prev,
                {
                  url: info.secure_url,
                  public_id: info.public_id,
                },
              ]);
            }
            setLoading(false);
          }}
          onError={() => setLoading(false)}
        >
          {loading ? (
            <>
              <LoadingOutlined spin />
              <span>Đang tải...</span>
            </>
          ) : (
            <>
              <UploadOutlined />
              <span>Thêm hình ảnh</span>
            </>
          )}
        </CldUploadButton>

        <Button
          icon={<SmileOutlined />}
          onClick={() => setShowEmoji((prev) => !prev)}
        >
          Biểu tượng cảm xúc
        </Button>
      </div>
      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24">
              <Image
                src={img.url}
                alt="preview"
                fill
                className="object-cover rounded-lg border"
              />
              <Popconfirm
                title="Xoá ảnh"
                description="Bạn có chắc muốn xoá ảnh này không?"
                okText="Xoá"
                cancelText="Huỷ"
                onConfirm={() => handleDeleteImage(img.public_id, i)}
              >
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  size="small"
                  icon={<DeleteOutlined />}
                  className="!absolute top-1 right-1 shadow-md"
                />
              </Popconfirm>
            </div>
          ))}
        </div>
      )}

      {showEmoji && (
        <div className="mt-2 border rounded-lg p-2 max-h-60 overflow-y-auto">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setPostContent((prev) => prev + emojiData.emoji);
              setShowEmoji(false);
            }}
          />
        </div>
      )}
      <div className="mt-4">
        <Button
          type="primary"
          block
          className="rounded-md bg-blue-600 hover:bg-blue-700"
          onClick={handlePost}
          disabled={!postContent.trim() && images.length === 0}
        >
          Đăng bài
        </Button>
      </div>
    </div>
  );
}
