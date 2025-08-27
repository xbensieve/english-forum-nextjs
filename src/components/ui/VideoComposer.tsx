"use client";

import React, { useState } from "react";
import { Avatar, Modal, Input, Button } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import SignInButton from "./SignInButton";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import dynamic from "next/dynamic";
import axios from "axios";
import toast from "react-hot-toast";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function VideoComposer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoData, setVideoData] = useState<{
    url: string;
    public_id: string;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { data: session } = useSession();

  if (!session) return <SignInButton />;

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    setVideoData(null);
    setTitle("");
    setShowEmojiPicker(false);
  };
  const handlePostVideo = async () => {
    if (!videoData || !title) {
      toast.error("Tiêu đề và video là bắt buộc");
      return;
    }

    try {
      const response = await axios.post("/api/videos", {
        title,
        videoUrl: videoData.url,
        publicId: videoData.public_id,
      });

      if (response.status !== 201) {
        throw new Error("Failed to save video to database");
      }

      toast.success("Video đã được đăng thành công!");
      window.dispatchEvent(
        new CustomEvent("video:new", { detail: response.data.video })
      );
      setVideoData(null);
      setTitle("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Failed to save video");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Avatar
            size={48}
            src={session?.user?.image}
            icon={!session?.user?.image && <UserOutlined />}
          />
        </div>
        <div className="flex-1">
          <button
            className="w-full text-left rounded-2xl shadow-sm h-12 flex items-center px-4 text-gray-500 hover:bg-gray-100 duration-300 cursor-pointer"
            onClick={showModal}
          >
            Chia sẻ video, {session.user?.name}...
          </button>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            <span>Hủy</span>
          </Button>,
          <Button
            key="post"
            type="primary"
            onClick={handlePostVideo}
            disabled={!videoData || !title}
          >
            <span>Đăng video</span>
          </Button>,
        ]}
        title="Đăng video"
      >
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Nhập tiêu đề video..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            suffix={
              <SmileOutlined
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                style={{ cursor: "pointer", fontSize: 20 }}
              />
            }
          />

          {showEmojiPicker && (
            <div className="mt-2">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setTitle((prev) => prev + emojiData.emoji);
                }}
              />
            </div>
          )}

          <CldUploadButton
            className="ant-btn ant-btn-default flex items-center gap-2 cursor-pointer hover:opacity-80 transition duration-200"
            uploadPreset="next_unsigned"
            options={{
              resourceType: "video",
              maxFileSize: 100 * 1024 * 1024,
              clientAllowedFormats: ["mp4", "mov", "webm", "mkv"],
            }}
            onSuccess={(result: CloudinaryUploadWidgetResults) => {
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
                setVideoData({
                  url: info.secure_url,
                  public_id: info.public_id,
                });
              }
            }}
          >
            <>
              <VideoCameraOutlined /> <span>Tải video lên</span>
            </>
          </CldUploadButton>

          {videoData && (
            <div className="mt-4">
              <video
                src={videoData.url}
                controls
                width={400}
                className="rounded-lg border"
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
