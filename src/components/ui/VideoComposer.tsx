"use client";

import React, { useState } from "react";
import { Avatar, Modal, Input, Tag, Button } from "antd";
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

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function VideoComposer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoData, setVideoData] = useState<{
    url: string;
    public_id: string;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [status, setStatus] = useState<string>("");

  const { data: session } = useSession();

  if (!session) return <SignInButton />;

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    setVideoData(null);
    setTitle("");
    setStatus("");
    setShowEmojiPicker(false);
    setUploading(false);
  };
  const handlePostVideo = async () => {
    if (!videoData || !title) {
      setStatus("Title and video are required");
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

      setStatus("Video saved successfully");
      setVideoData(null);
      setTitle("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving video:", error);
      setStatus("Failed to save video");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-start gap-4">
        <Avatar
          size={48}
          src={session?.user?.image}
          icon={!session?.user?.image && <UserOutlined />}
        />
        <div className="flex-1">
          <button
            className="w-full text-left rounded-2xl shadow-sm h-12 flex items-center px-4 text-gray-500 hover:bg-gray-100 duration-300 cursor-pointer"
            onClick={showModal}
          >
            Chia sẻ video, {session.user?.name}?
          </button>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="post"
            type="primary"
            onClick={handlePostVideo}
            disabled={!videoData || !title || uploading}
          >
            Post Video
          </Button>,
        ]}
        title="Upload Video"
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
                setStatus("Uploaded successfully");
              }
              setUploading(false);
            }}
            onOpen={() => {
              setUploading(true);
              setStatus("Uploading...");
            }}
          >
            <>
              <VideoCameraOutlined />{" "}
              {uploading ? "Uploading..." : "Upload Video"}
            </>
          </CldUploadButton>

          {status && (
            <Tag
              color={
                uploading ? "blue" : status.includes("Failed") ? "red" : "green"
              }
            >
              {status}
            </Tag>
          )}

          {videoData && (
            <div className="mt-4">
              <video
                src={videoData.url}
                controls
                width={400}
                className="rounded-lg border"
              />
              <p className="mt-2 text-gray-500 text-sm">Title: {title}</p>
              <p className="mt-2 text-gray-500 text-sm">URL: {videoData.url}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
