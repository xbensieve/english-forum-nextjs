"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Typography, Spin } from "antd";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MessageCircle, Sparkles, UserX } from "lucide-react";
import Link from "next/link";

const { Text } = Typography;

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export default function UserPage() {
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/users/${id}/detail`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChat = (userId: string) => {
    const encodedId = btoa(userId);
    router.push(`/chat/${encodedId}`);
  };
  if (loading) return <Spin fullscreen />;

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen px-4 py-8 relative">
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

  const handleComingSoon = (feature: string) => {
    toast(
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <span>{feature} is coming soon</span>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-150 px-4 py-8 relative">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar
            size={64}
            src={user.avatar}
            icon={!user.avatar && <UserOutlined />}
          />
          <div>
            <Text strong>{user.name}</Text>
            <br />
            <Text type="secondary">{user.email}</Text>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white font-medium shadow-md hover:bg-blue-600 transition duration-200 cursor-pointer"
            onClick={() => handleComingSoon("Add Friend")}
          >
            <UserAddOutlined className="text-[18px]" />
            <span>Add Friend</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-white font-medium shadow-md hover:bg-blue-600 transition duration-200 cursor-pointer"
            onClick={() => handleChat(user._id)}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}
