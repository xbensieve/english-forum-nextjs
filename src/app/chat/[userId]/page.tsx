"use client";

import { Avatar, Button, Card, Input, Spin, Typography } from "antd";
import axios from "axios";
import { UserX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";

const { Text } = Typography;

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export default function ChatPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    try {
      const realId = atob(userId);
      axios
        .get(`/api/users/${realId}/detail`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Invalid userId encoding", err);
      setLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className=" p-8 flex flex-col items-center gap-4">
          <Text type="secondary" className="text-lg">
            Please log in to continue
          </Text>
          <Link
            href="/login"
            className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Spin fullscreen />;

  const handleViewProfile = (id: string) => {
    router.push(`/users/${id}`);
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <UserX className="w-12 h-12 text-red-400" />
          <p className="text-lg font-medium">User not found</p>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="w-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl gap-3">
        <div className="w-full md:w-3/4 flex">
          <Card className="w-full h-[600px] flex flex-col relative">
            <div className="flex items-center gap-3 p-2 border-b">
              {user.avatar ? (
                <Avatar
                  src={
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={48}
                      height={48}
                    />
                  }
                  size={48}
                />
              ) : (
                <UserX className="w-12 h-12 text-gray-400" />
              )}
              <h3 className="text-lg font-semibold">{user.name}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-20">
              <div className="bg-gray-100 p-2 rounded-lg w-fit">Hello 👋</div>
              <div className="bg-blue-500 text-white p-2 rounded-lg w-fit self-end">
                Hi there!
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-3 flex items-center space-x-2">
              <Input
                placeholder="Nhập tin nhắn..."
                className="flex-1"
                suffix={
                  <SmileOutlined
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    style={{ cursor: "pointer", fontSize: 20 }}
                  />
                }
              />

              {showEmojiPicker && (
                <div
                  ref={pickerRef}
                  className="absolute bottom-14 right-16 z-50 shadow-lg md:bottom-14 md:right-16 w-[90%] max-w-xs md:w-auto"
                >
                  <EmojiPicker />
                </div>
              )}

              <div
                className="w-10 h-10 flex items-center justify-center 
             text-blue-600 cursor-pointer rounded-full 
             hover:bg-blue-100 transition-colors duration-200"
              >
                <SendOutlined />
              </div>
            </div>
          </Card>
        </div>

        <div className="hidden md:flex w-1/4">
          <Card className="w-full h-[600px] flex flex-col items-center justify-start gap-4 p-6">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={96}
                height={96}
                className="rounded-full object-cover mx-auto block"
              />
            ) : (
              <UserX className="w-24 h-24 text-gray-400 mx-auto" />
            )}
            <h3 className="text-xl font-semibold text-center">{user.name}</h3>
            <p className="text-gray-600 text-center">{user.email}</p>
            <Button
              type="primary"
              className="mt-auto w-full"
              onClick={() => handleViewProfile(user._id)}
            >
              View Profile
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
