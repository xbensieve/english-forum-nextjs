"use client";

import React, { useState, useEffect } from "react";
import { Layout, Spin, Avatar, Typography, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

import VideoComposer from "@/components/ui/VideoComposer";

const { Content } = Layout;
const { Title, Text } = Typography;

/* ---------- Types ---------- */
interface Video {
  _id: string;
  title: string;
  videoUrl: string;
  publicId: string;
  userId: string;
  userImage?: string;
  userName: string;
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

/* ---------- Component ---------- */
export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  /* Fetch videos */
  const fetchVideos = async (pageToLoad: number) => {
    try {
      setLoading(true);
      const { data } = await axios.get<ApiResponse>("/api/videos", {
        params: { page: pageToLoad, limit },
      });

      // Deduplicate videos to avoid duplicate key errors
      setVideos((prev) => {
        if (pageToLoad === 1) {
          return data.videos; // Reset videos on first page
        }
        const existingIds = new Set(prev.map((video) => video._id));
        const newVideos = data.videos.filter(
          (video) => !existingIds.has(video._id)
        );
        return [...prev, ...newVideos];
      });

      setHasMore(data.pagination.hasMore);
      setPage(pageToLoad); // Update page to current
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Initial fetch */
  useEffect(() => {
    fetchVideos(1);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <Layout>
        <Content className="p-6 w-full max-w-2xl">
          <VideoComposer />

          <div className="mt-6 space-y-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-2xl shadow-lg p-4"
              >
                {/* User Info */}
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

                {/* Video Content */}
                <Title level={5} className="mt-2">
                  {video.title}
                </Title>
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full rounded-lg border"
                  style={{ maxHeight: "600px" }}
                />
              </div>
            ))}

            {/* Loading / End States */}
            {loading && (
              <div className="flex justify-center mt-4">
                <Spin size="large" />
              </div>
            )}

            {/* Load More Button or End Message */}
            {hasMore ? (
              <div className="flex justify-center py-4">
                <Button onClick={() => fetchVideos(page + 1)} loading={loading}>
                  {loading ? "Đang tải..." : "Xem thêm"}
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Bạn đã xem hết tất cả video
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </div>
  );
}
