"use client";
import { Modal, List, Avatar } from "antd";
import type { ILike } from "@/types/PostDetail";

interface LikesModalProps {
  open: boolean;
  onClose: () => void;
  likes: ILike[];
}

export default function LikesModal({ open, onClose, likes }: LikesModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="People who liked this"
    >
      <List<ILike>
        dataSource={likes}
        renderItem={(like) => (
          <List.Item key={like._id}>
            <List.Item.Meta
              avatar={<Avatar src={like.userId?.avatar} />}
              title={like.userId?.name}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
}
