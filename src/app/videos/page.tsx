"use client";

import React, { useState, useEffect } from "react";
import { Layout, Avatar, Typography, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

import VideoComposer from "@/components/ui/VideoComposer";
import VideoPlayer from "@/components/ui/video/VideoPlayer";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Video {
  _id: string;
  title: string;
  videoUrl: string;
  publicId: string;
  userId: string;
  userImage?: string;
  userName: string;
  views?: number;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasMore: boolean;
}

interface ApiResponse {
  videos: Video[];
  pagination: Pagination;
}

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchVideos = async (pageToLoad: number) => {
    try {
      setLoading(true);
      const { data } = await axios.get<ApiResponse>("/api/videos", {
        params: { page: pageToLoad, limit },
      });

      setVideos((prev) => {
        if (pageToLoad === 1) {
          return data.videos;
        }
        const existingIds = new Set(prev.map((video) => video._id));
        const newVideos = data.videos.filter(
          (video) => !existingIds.has(video._id)
        );
        return [...prev, ...newVideos];
      });

      setHasMore(data.pagination.hasMore);
      setPage(pageToLoad);
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const handleView = async (videoId: string) => {
    try {
      await axios.post(`/api/videos/${videoId}/view`);
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, views: (v.views || 0) + 1 } : v
        )
      );
    } catch (error) {
      console.error("Failed to increment view:", error);
    }
  };
  useEffect(() => {
    const handler = (e: Event) => {
      const { detail } = e as CustomEvent<Video>;
      setVideos((prev) => [detail, ...prev]);
    };
    window.addEventListener("video:new", handler);
    return () => window.removeEventListener("video:new", handler);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Layout>
        <Content className="p-6 flex justify-center items-center">
          <div className="w-full max-w-2xl space-y-3">
            <VideoComposer />
            <div className="mt-6 space-y-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-white rounded-2xl shadow-lg p-4"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      size={48}
                      src={video.userImage}
                      icon={!video.userImage && <UserOutlined />}
                    />
                    <div>
                      <Text strong>{video.userName}</Text>
                      <br />
                      <Text type="secondary">
                        {new Date(video.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        {new Date(video.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </Text>
                    </div>
                  </div>
                  <Title level={5} className="mt-2">
                    {video.title}
                  </Title>
                  <VideoPlayer videoId={video._id} src={video.videoUrl} />
                  <div className="mt-2 text-sm text-gray-500 flex justify-end">
                    {video.views
                      ? `${video.views} lượt xem`
                      : "Chưa có lượt xem"}
                  </div>
                </div>
              ))}

              {hasMore ? (
                <div className="flex justify-center py-4">
                  <Button
                    onClick={() => fetchVideos(page + 1)}
                    loading={loading}
                  >
                    {loading ? "Đang tải..." : "Xem thêm"}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Bạn đã xem hết tất cả video
                </div>
              )}
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
