"use client";

import { Button } from "antd";
import Image from "next/image";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "./ChatPage";

interface UserInfoCardProps {
  user: User;
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
  const router = useRouter();

  return (
    <div className="w-full h-[600px] flex flex-col items-center justify-start gap-4 p-6">
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
        onClick={() => router.push(`/users/${user._id}`)}
      >
        View Profile
      </Button>
    </div>
  );
}
