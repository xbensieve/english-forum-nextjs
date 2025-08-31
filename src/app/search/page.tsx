"use client";

import { useState } from "react";
import { Input, Avatar, Typography, Spin, Empty, Button } from "antd";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<User[]>([]);

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(value)}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data: User[] = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-6">
      <Typography.Title level={3} className="text-center mb-6">
        <span>Tìm kiếm người dùng</span>
      </Typography.Title>

      <Input.Search
        placeholder="Tìm kiếm theo tên hoặc email"
        enterButton="Tìm kiếm"
        size="large"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
        className="mb-6"
      />

      {loading && (
        <div className="flex justify-center mt-6">
          <Spin size="large" />
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <Empty
          description="Không có người dùng nào được tìm thấy"
          className="mt-6"
        />
      )}

      <div className="flex flex-col divide-y rounded-xl bg-white max-h-[500px] overflow-y-auto">
        {results.map((user) => (
          <div key={user._id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar size={48} src={user.avatar}>
                {user.name?.[0]}
              </Avatar>
              <div className="flex flex-col">
                <Typography.Text strong>{user.name}</Typography.Text>
                <Typography.Text type="secondary" className="text-sm">
                  {user.email}
                </Typography.Text>
              </div>
            </div>

            {/* Right: Message button */}
            <Link href={`/chat/${btoa(user._id)}`}>
              <Button type="primary" className="rounded-lg">
                <span>Nhắn tin</span>
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
