"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Card, Divider } from "antd";
import type { PostDetailResponse, ILike } from "@/types/PostDetail";
import PostHeader from "@/components/ui/post/PostHeader";
import PostContent from "@/components/ui/post/PostContent";
import PostStats from "@/components/ui/post/PostStats";
import ReactionBar from "@/components/ui/post/ReactionBar";
import CommentSection from "@/components/ui/post/CommentSection";
import LikesModal from "@/components/ui/post/LikesModal";
import Loading from "@/components/ui/Loading";
import { ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [postDetail, setPostDetail] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const router = useRouter();
  const currentUserId = session?.user?.id;

  const fetchPostDetail = useCallback(async () => {
    try {
      const { data } = await axios.get<PostDetailResponse>(
        `/api/posts/${id}/detail`
      );
      setPostDetail(data);

      if (currentUserId) {
        setLiked(data.likes.some((l: ILike) => l.userId._id === currentUserId));
      }
    } catch (err) {
      console.error("Failed to fetch post detail:", err);
    } finally {
      setLoading(false);
    }
  }, [id, currentUserId]);

  useEffect(() => {
    if (id && currentUserId) fetchPostDetail();
  }, [id, currentUserId, fetchPostDetail]);

  if (loading) return <Loading />;

  if (!postDetail) return <p>Post not found</p>;

  const { post, comments, likes, likesCount, commentsCount } = postDetail;

  const handleToggleLike = async () => {
    try {
      const { data } = await axios.post(`/api/posts/${id}/like`);

      setLiked(data.liked);

      setPostDetail((prev) =>
        prev
          ? {
              ...prev,
              likesCount: prev.likesCount + (data.liked ? 1 : -1),
              likes: data.liked
                ? [
                    ...prev.likes,
                    {
                      _id: "temp",
                      userId: {
                        _id: currentUserId!,
                        name: session?.user?.name || "You",
                      },
                    } as ILike,
                  ]
                : prev.likes.filter((l) => l.userId._id !== currentUserId),
            }
          : prev
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleAddComment = async (text: string) => {
    try {
      const { data } = await axios.post(`/api/posts/${id}/comment`, {
        content: text,
      });

      if (data.success) {
        const newComment = {
          ...data.comment,
          userId: {
            _id: currentUserId!,
            name: session?.user?.name ?? "You",
            avatar: session?.user?.image ?? "",
          },
        };

        setPostDetail((prev) =>
          prev
            ? {
                ...prev,
                comments: [newComment, ...prev.comments],
                commentsCount: prev.commentsCount + 1,
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card
        variant="outlined"
        styles={{ body: { padding: 16 } }}
        className="rounded-2xl shadow-sm"
      >
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <CloseOutlined />
        </button>
        <PostHeader
          avatar={post.userId?.avatar || post.userImage}
          userName={post.userName}
          createdAt={post.createdAt}
        />
        <PostContent content={post.content} imageUrls={post.imageUrls} />
        <PostStats
          likesCount={likesCount}
          commentsCount={commentsCount}
          onShowLikes={() => setShowLikes(true)}
        />
        <Divider className="my-2" />
        <ReactionBar liked={liked} onToggleLike={handleToggleLike} />
        <Divider className="my-2" />
        <CommentSection
          image={session?.user?.image || ""}
          comments={comments}
          onAddComment={handleAddComment}
        />
      </Card>
      <LikesModal
        open={showLikes}
        onClose={() => setShowLikes(false)}
        likes={likes}
      />
    </div>
  );
}
