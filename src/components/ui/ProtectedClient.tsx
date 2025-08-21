"use client";
import { useSession } from "next-auth/react";

export default function ProtectedClient() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <p>Role: {(session.user as any).role}</p>
    </div>
  );
}
