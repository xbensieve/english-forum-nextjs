"use client";
import { signIn, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <p>
        Welcome {session.user?.name} ({session.user?.role})
      </p>
    );
  }

  return <button onClick={() => signIn("google")}>Login with Google</button>;
}
