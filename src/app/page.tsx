"use client";
import PostComposer from "@/components/ui/PostComposer";
import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Card, Avatar, List, Button, message, Typography } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PostImages from "@/components/ui/PostImages";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const { Content } = Layout;
const { Text } = Typography;
interface Post {
  _id: string;
  userName?: string;
  userImage?: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  imageUrls?: string[];
  likes?: { userId: { _id: string } }[];
  createdAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const limit = 5;

  useEffect(() => {
    loadPosts(1);
  }, []);

  const loadPosts = async (pageToLoad: number) => {
    try {
      setLoading(true);
      const response = await axios.get<{
        posts: Post[];
        total: number;
        hasMore: boolean;
      }>(`/api/posts?page=${pageToLoad}&limit=${limit}`);

      if (pageToLoad === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts((prev) => [...prev, ...response.data.posts]);
      }

      setHasMore(response.data.hasMore);
      setPage(pageToLoad);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = async (content: string, imageUrls: string[]) => {
    try {
      const response = await axios.post<Post>("/api/posts", {
        content,
        imageUrls,
      });
      if (response.status === 201) {
        setPosts((prev) => [response.data, ...prev]);
        toast.success("Bài viết đã được tạo thành công!");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like`);
      const data = res.data;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likesCount: data.liked
                  ? post.likesCount + 1
                  : post.likesCount - 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/posts/${postId}/detail`);
  };
  const handleShare = async (postId: string) => {
    const url = `${window.location.origin}/posts/${postId}/detail`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post!",
          text: "I found this interesting post, have a look:",
          url,
        });
      } catch (err) {
        console.error("Share cancelled or failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        message.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Layout>
        <Content className="p-6 flex justify-center items-center">
          <div className="w-full max-w-2xl space-y-3">
            <PostComposer onPostCreated={handlePostCreated} />

            {posts.length === 0 ? (
              loading ? (
                <div className="text-center py-4 text-gray-500">
                  Đang tải...
                </div>
              ) : null
            ) : (
              <List
                itemLayout="vertical"
                dataSource={posts}
                loadMore={
                  hasMore ? (
                    <div className="flex justify-center py-4">
                      <Button
                        onClick={() => loadPosts(page + 1)}
                        loading={loading}
                      >
                        {loading ? "Đang tải..." : "Xem thêm"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      Bạn đã xem hết tất cả bài viết
                    </div>
                  )
                }
                renderItem={(item) => (
                  <List.Item key={item._id} style={{ marginBottom: "3px" }}>
                    <Card className="shadow rounded-2xl">
                      <List.Item.Meta />
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar
                          size={48}
                          src={item.userImage}
                          icon={!item.userImage && <UserOutlined />}
                        />
                        <div>
                          <Text strong>{item.userName}</Text>
                          <br />
                          <Text type="secondary">
                            {new Date(item.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                            {new Date(item.createdAt).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </Text>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap mb-4">
                        {item.content}
                      </div>
                      {item.imageUrls && item.imageUrls.length > 0 && (
                        <PostImages images={item.imageUrls} />
                      )}

                      <div className="flex justify-between text-sm text-gray-500 mt-2 mb-2">
                        <span>
                          {item.likesCount > 0
                            ? `${item.likesCount} Likes`
                            : "No Likes"}
                        </span>
                        <span>
                          {item.commentsCount > 0
                            ? `${item.commentsCount} Comments`
                            : "No Comments"}
                        </span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between w-full">
                          <Button
                            type="text"
                            className="flex-1 mx-1 transition-all duration-200 hover:w-[40%]"
                            icon={<LikeOutlined />}
                            onClick={() => handleLike(item._id)}
                          >
                            Like
                          </Button>
                          <Button
                            type="text"
                            className="flex-1 mx-1 transition-all duration-200 hover:w-[40%]"
                            icon={<CommentOutlined />}
                            onClick={() => handleComment(item._id)}
                          >
                            Comment
                          </Button>
                          <Button
                            type="text"
                            onClick={() => handleShare(item._id)}
                            className="flex-1 mx-1 transition-all duration-200 hover:w-[40%]"
                            icon={<ShareAltOutlined />}
                          >
                            Share
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </div>
        </Content>
      </Layout>
    </div>
  );
}
