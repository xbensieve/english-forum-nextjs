"use client";

import { signOut, useSession } from "next-auth/react";
import { Button, Typography } from "antd";
import Image from "next/image";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Text type="secondary">Please log in.</Text>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className="flex flex-col items-center p-6 space-y-4">
        <Image
          src={session.user.image || "/default-avatar.png"}
          alt={session.user.name || "Profile"}
          className="w-24 h-24 rounded-full border-2 border-gray-200"
          width={96}
          height={96}
        />
        <Title level={4} className="!m-0 text-gray-900">
          {session.user.name}
        </Title>
        <Text type="secondary" className="text-gray-600">
          {session.user.email}
        </Text>
        <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded">
          {session.user.role?.toUpperCase() || "USER"}
        </span>
        <Button type="primary" onClick={() => signOut()}>
          Sign Out{" "}
        </Button>
      </div>
    </div>
  );
}
