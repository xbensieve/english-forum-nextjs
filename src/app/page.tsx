"use client";
import PostComposer from "@/components/ui/PostComposer";
import { useState } from "react";
import { Layout, Card, Avatar, List, Space, Button, Input } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
export default function HomePage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Alice",
      content: "Hello! This is my first post.",
      likes: 0,
      comments: [] as string[],
    },
    {
      id: 2,
      author: "Bob",
      content: "English is fun to learn together!",
      likes: 2,
      comments: [] as string[],
    },
  ]);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});

  const handleAddPost = (content: string) => {
    if (!content.trim()) return;
    setPosts([
      {
        id: Date.now(),
        author: "You",
        content,
        likes: 0,
        comments: [],
      },
      ...posts,
    ]);
  };

  const handleLike = (id: number) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleComment = (id: number) => {
    if (!commentText[id]?.trim()) return;
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, comments: [...p.comments, commentText[id]] } : p
      )
    );
    setCommentText({ ...commentText, [id]: "" });
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Layout>
        <Content className="p-6 flex justify-center items-center">
          <div className="w-full max-w-2xl space-y-3">
            <PostComposer onSubmit={handleAddPost} />
            <List
              itemLayout="vertical"
              dataSource={posts}
              renderItem={(item) => (
                <List.Item style={{ marginBottom: "3px" }}>
                  <Card className="shadow rounded-2xl">
                    <List.Item.Meta
                      avatar={<Avatar>{item.author[0]}</Avatar>}
                      title={
                        <span className="font-semibold">{item.author}</span>
                      }
                      description={item.content}
                    />
                    <div className="border-t pt-3">
                      <Space size="large">
                        <Button
                          type="text"
                          icon={<LikeOutlined />}
                          onClick={() => handleLike(item.id)}
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
                            value={commentText[item.id] || ""}
                            onChange={(e) =>
                              setCommentText({
                                ...commentText,
                                [item.id]: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="primary"
                            onClick={() => handleComment(item.id)}
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
          </div>
        </Content>
      </Layout>
    </div>
  );
}
