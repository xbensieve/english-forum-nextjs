"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function SignInButton() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8 text-center">
      <h1 className="text-xl font-semibold text-gray-800 mb-2">
        Đăng nhập để tiếp tục
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Hãy kết nối tài khoản của bạn để tham gia.
      </p>

      <button
        onClick={handleSignIn}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 rounded-full 
          bg-sky-500 text-white font-medium py-3 px-4 transition-colors duration-200 cursor-pointer
          ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-sky-600"}`}
      >
        {loading ? (
          <ReloadIcon className="w-5 h-5 animate-spin" />
        ) : (
          <Image
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="w-5 h-5 bg-white rounded-full p-0.5"
          />
        )}
        <span>{loading ? "Đang đăng nhập..." : "Tiếp tục với Google"}</span>
      </button>
    </div>
  );
}
