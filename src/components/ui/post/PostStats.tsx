"use client";
interface PostStatsProps {
  likesCount: number;
  commentsCount: number;
  onShowLikes: () => void;
}

export default function PostStats({
  likesCount,
  commentsCount,
  onShowLikes,
}: PostStatsProps) {
  return (
    <div className="flex text-sm text-gray-500 mb-2">
      <span
        className="flex-1 text-left cursor-pointer hover:underline"
        onClick={onShowLikes}
      >
        {likesCount} Likes
      </span>
      <span className="flex-1 text-right">{commentsCount} Comments</span>
    </div>
  );
}
