"use client";
import { List, Avatar } from "antd";
import CommentBox from "@/components/ui/CommentBox";
import type { IComment } from "@/types/PostDetail";

interface CommentSectionProps {
  image: string;
  comments: IComment[];
  onAddComment: (text: string) => void;
}

export default function CommentSection({
  image,
  comments,
  onAddComment,
}: CommentSectionProps) {
  return (
    <div>
      <CommentBox image={image} onSubmitAction={onAddComment} />
      <List<IComment>
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item key={comment._id}>
            <List.Item.Meta
              avatar={<Avatar src={comment.userId?.avatar} />}
              title={
                <span className="font-medium">{comment.userId?.name}</span>
              }
              description={<span>{comment.content}</span>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
