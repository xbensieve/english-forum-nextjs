"use client";

import { Layout, Card, Typography, Row, Col } from "antd";
import Image from "next/image";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

// Fake trending data
const trendingData = [
  {
    id: 1,
    title: "AI đang thay đổi thế giới như thế nào?",
    description:
      "Trí tuệ nhân tạo đang len lỏi vào mọi lĩnh vực, từ giáo dục, y tế đến tài chính và sáng tạo.",
    cover:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Khám phá vũ trụ: Nasa tìm thấy hành tinh mới",
    description:
      "Các nhà khoa học vừa công bố một hành tinh có điều kiện gần giống Trái Đất.",
    cover:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Thế giới công nghệ blockchain 2025",
    description:
      "Blockchain tiếp tục chứng minh sức mạnh với các ứng dụng ngoài tài chính.",
    cover:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
];

export default function TrendingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <Layout>
        <Content className="p-6 max-w-5xl mx-auto">
          <Title level={2} style={{ marginBottom: 24 }}>
            Trending Today
          </Title>

          <Row gutter={[24, 24]}>
            {trendingData.map((item) => (
              <Col xs={24} sm={12} md={8} key={item.id} className="flex">
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  cover={
                    <div className="relative w-full h-56">
                      <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  }
                >
                  <div className="flex flex-col flex-1">
                    <Title level={4}>{item.title}</Title>
                    <Paragraph ellipsis={{ rows: 3 }}>
                      {item.description}
                    </Paragraph>
                    <div className="mt-auto">
                      <Text type="secondary">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(item.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </div>
  );
}
