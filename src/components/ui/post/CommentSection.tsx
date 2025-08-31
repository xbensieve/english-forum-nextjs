"use client";
import { List, Avatar } from "antd";
import CommentBox from "@/components/ui/post/CommentBox";
import type { IComment } from "@/types/PostDetail";

interface CommentSectionProps {
  image: string;
  comments: IComment[];
  onAddComment: (text: string) => void;
  disabled: boolean;
}

export default function CommentSection({
  image,
  comments,
  onAddComment,
  disabled,
}: CommentSectionProps) {
  return (
    <div>
      <CommentBox
        image={image}
        onSubmitAction={onAddComment}
        disabled={disabled}
      />
      <List<IComment>
        itemLayout="horizontal"
        dataSource={comments}
        locale={{ emptyText: "Không có bình luận" }}
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
