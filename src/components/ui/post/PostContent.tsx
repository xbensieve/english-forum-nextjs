"use client";
import PostImages from "@/components/ui/PostImages";

interface PostContentProps {
  content: string;
  imageUrls?: string[];
}

export default function PostContent({ content, imageUrls }: PostContentProps) {
  return (
    <div>
      <div className="mb-3 text-base">{content}</div>
      {imageUrls && imageUrls.length > 0 && <PostImages images={imageUrls} />}
    </div>
  );
}
