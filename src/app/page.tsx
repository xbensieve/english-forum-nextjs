"use client";
import PostComposer from "@/components/ui/PostComposer";
import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Card, Avatar, List, Space, Button, Input, Empty } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import PostImages from "@/components/ui/PostImages";
const { Content } = Layout;

interface Post {
  _id: string;
  userName?: string;
  userImage?: string;
  content: string;
  likes: number;
  comments: string[];
  imageUrls?: string[];
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const limit = 5;

  useEffect(() => {
    loadPosts(1);
  }, []);

  const loadPosts = async (pageToLoad: number) => {
    try {
      setLoading(true);
      const response = await axios.get<{ posts: Post[]; hasMore: boolean }>(
        `/api/posts?page=${pageToLoad}&limit=${limit}`
      );
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
      setPosts((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (postId: string) => {
    const comment = commentText[postId];
    if (!comment) return;

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Layout>
        <Content className="p-6 flex justify-center items-center">
          <div className="w-full max-w-2xl space-y-3">
            <PostComposer onPostCreated={handlePostCreated} />

            {posts.length === 0 && !loading ? (
              <Empty description="Chưa có bài viết nào" />
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
                      <List.Item.Meta
                        avatar={<Avatar src={item.userImage?.trim()} />}
                        title={
                          <span className="font-semibold">
                            {item.userName || "Unknown"}
                          </span>
                        }
                        description={
                          <span className="text-gray-950">{item.content}</span>
                        }
                      />
                      {item.imageUrls && item.imageUrls.length > 0 && (
                        <PostImages images={item.imageUrls} />
                      )}
                      <div className="border-t pt-3">
                        <Space size="large">
                          <Button
                            type="text"
                            icon={<LikeOutlined />}
                            onClick={() => handleLike(item._id)}
                          >
                            {item.likes > 0 ? `${item.likes} Like` : "Like"}
                          </Button>
                          <Button type="text" icon={<CommentOutlined />}>
                            Comment
                          </Button>
                          <Button type="text" icon={<ShareAltOutlined />}>
                            Share
                          </Button>
                        </Space>

                        <div className="mt-3 space-y-2">
                          {item.comments.map((c, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-100 p-2 rounded-lg text-sm"
                            >
                              <span className="font-semibold">User:</span> {c}
                            </div>
                          ))}

                          <div className="flex gap-2 mt-2">
                            <Input
                              placeholder="Write a comment..."
                              value={commentText[item._id] || ""}
                              onChange={(e) =>
                                setCommentText({
                                  ...commentText,
                                  [item._id]: e.target.value,
                                })
                              }
                            />
                            <Button
                              type="primary"
                              onClick={() => handleComment(item._id)}
                            >
                              Send
                            </Button>
                          </div>
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
