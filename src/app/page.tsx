"use client";
import SignOutButton from "@/components/ui/SignOutButton";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not logged in</p>;
  }
  return (
    <div>
      <h1>Welcome {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <SignOutButton />
      <img
        src={session.user?.image || ""}
        alt="User Avatar"
        className="rounded-full w-16 h-16"
      />
      <p>Role: {session.user?.role}</p>
    </div>
  );
}
