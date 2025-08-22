"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { signIn, useSession } from "next-auth/react";
import PostInput from "./PostInput";
import SignInButton from "./SignInButton";
interface PostComposerProps {
  onSubmit: (content: string) => void;
}
export default function PostComposer({ onSubmit }: PostComposerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);
  const { data: session } = useSession();
  if (!session) {
    return <SignInButton />;
  }
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
            What&#39;s on your mind, {session.user?.name}?
          </button>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        styles={{
          mask: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
        }}
      >
        <PostInput
          session={{
            user: session?.user
              ? {
                  name: session.user.name ?? undefined,
                  image: session.user.image ?? undefined,
                }
              : undefined,
          }}
          onClose={handleCancel}
          onSubmit={onSubmit}
        />
      </Modal>
    </div>
  );
}
