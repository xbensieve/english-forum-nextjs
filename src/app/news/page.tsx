"use client";

import React, { useMemo, useState } from "react";
import {
  Layout,
  Typography,
  Input,
  Select,
  Card,
  Tag,
  Pagination,
  Space,
  Divider,
  Empty,
} from "antd";
import { CalendarOutlined, FireOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

/* ========== Types ========== */
type NewsItem = {
  id: string;
  title: string;
  summary: string;
  cover?: string;
  category: "Công nghệ" | "Kinh doanh" | "Thể thao" | "Giải trí" | "Thời sự";
  publishedAt: string; // ISO
  views: number;
  slug: string;
  tags: string[];
};

/* ========== Utils ========== */
const formatVNDateTime = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`;
};

/* ========== Fake data ========== */
const FAKE_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Ra mắt chip AI mới tối ưu cho laptop mỏng nhẹ",
    summary:
      "Thế hệ chip AI mới mang lại hiệu năng xử lý mô hình gấp 2 lần, tiết kiệm điện năng 30% so với thế hệ trước.",
    cover:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    category: "Công nghệ",
    publishedAt: "2025-08-26T08:25:00.000Z",
    views: 12840,
    slug: "chip-ai-moi-cho-laptop",
    tags: ["AI", "Laptop", "Chip"],
  },
  {
    id: "n2",
    title: "Thị trường chứng khoán đỏ lửa phiên sáng",
    summary:
      "Các nhóm cổ phiếu ngân hàng, thép điều chỉnh mạnh khiến chỉ số lùi về dưới tham chiếu.",
    cover:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    category: "Kinh doanh",
    publishedAt: "2025-08-27T03:10:00.000Z",
    views: 9321,
    slug: "chung-khoan-do-lua",
    tags: ["Chứng khoán", "Ngân hàng"],
  },
  {
    id: "n3",
    title: "Đội tuyển quốc gia công bố danh sách 26 cầu thủ",
    summary:
      "HLV trưởng gọi nhiều gương mặt trẻ, chuẩn bị cho vòng loại sắp tới với mục tiêu vào sâu.",
    cover:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop",
    category: "Thể thao",
    publishedAt: "2025-08-25T15:45:00.000Z",
    views: 15002,
    slug: "doi-tuyen-cong-bo-danh-sach",
    tags: ["Bóng đá", "Đội tuyển"],
  },
  {
    id: "n4",
    title: "Bom tấn mùa hè dẫn đầu phòng vé tuần qua",
    summary:
      "Bộ phim mới đạt doanh thu ấn tượng, vượt mốc 100 tỷ chỉ sau 3 ngày khởi chiếu.",
    cover:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop",
    category: "Giải trí",
    publishedAt: "2025-08-24T12:00:00.000Z",
    views: 22100,
    slug: "bom-tan-dan-dau-phong-ve",
    tags: ["Phim chiếu rạp", "Box Office"],
  },
  {
    id: "n5",
    title: "Mưa lớn gây ngập cục bộ nhiều tuyến phố",
    summary:
      "Cơ quan khí tượng cảnh báo tiếp tục mưa rào trong 24 giờ tới, người dân cần theo dõi thông tin.",
    cover:
      "https://images.unsplash.com/photo-1470350576089-539d5a852bf7?q=80&w=1200&auto=format&fit=crop",
    category: "Thời sự",
    publishedAt: "2025-08-27T05:20:00.000Z",
    views: 6420,
    slug: "mua-lon-gay-ngap",
    tags: ["Thời tiết", "Cảnh báo"],
  },
  // thêm vài item nữa cho nhiều trang
  {
    id: "n6",
    title: "Startup gọi vốn 5 triệu USD cho nền tảng phân tích dữ liệu",
    summary:
      "Vòng seed do quỹ quốc tế dẫn dắt, tập trung mở rộng thị trường khu vực.",
    cover:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    category: "Kinh doanh",
    publishedAt: "2025-08-23T09:00:00.000Z",
    views: 3200,
    slug: "startup-goi-von-5-trieu",
    tags: ["Startup", "Đầu tư"],
  },
  {
    id: "n7",
    title: "Ứng dụng nhắn tin cập nhật tính năng bảo mật mới",
    summary:
      "Tin nhắn tự hủy linh hoạt theo chủ đề, mã hóa nâng cao cho nhóm lớn.",
    cover:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop",
    category: "Công nghệ",
    publishedAt: "2025-08-22T14:12:00.000Z",
    views: 4800,
    slug: "ung-dung-bao-mat-moi",
    tags: ["Bảo mật", "Ứng dụng"],
  },
  {
    id: "n8",
    title: "Giải điền kinh quốc tế khởi tranh cuối tuần",
    summary: "Nhiều VĐV hàng đầu khu vực góp mặt, hứa hẹn cuộc đua kịch tính.",
    cover:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
    category: "Thể thao",
    publishedAt: "2025-08-21T06:30:00.000Z",
    views: 2100,
    slug: "giai-dien-kinh-khoi-tranh",
    tags: ["Điền kinh", "Giải đấu"],
  },
  {
    id: "n9",
    title: "Ca sĩ A công bố tour diễn xuyên Việt",
    summary: "Chuỗi concert đi qua 6 thành phố lớn, mở bán vé từ tuần tới.",
    cover:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop",
    category: "Giải trí",
    publishedAt: "2025-08-20T10:05:00.000Z",
    views: 7800,
    slug: "tour-dien-xuyen-viet",
    tags: ["Concert", "Âm nhạc"],
  },
  {
    id: "n10",
    title: "Cập nhật quy hoạch giao thông khu trung tâm",
    summary:
      "Thêm các trục đường một chiều, tối ưu luồng lưu thông giờ cao điểm.",
    cover:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200&auto=format&fit=crop",
    category: "Thời sự",
    publishedAt: "2025-08-19T04:45:00.000Z",
    views: 5600,
    slug: "quy-hoach-giao-thong",
    tags: ["Hạ tầng", "Giao thông"],
  },
  {
    id: "n11",
    title: "Nền tảng học trực tuyến bổ sung khóa AI căn bản",
    summary: "Khóa học miễn phí cho người mới bắt đầu, gồm bài tập thực hành.",
    cover:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop",
    category: "Công nghệ",
    publishedAt: "2025-08-18T13:30:00.000Z",
    views: 3000,
    slug: "khoa-ai-can-ban",
    tags: ["Edtech", "AI"],
  },
  {
    id: "n12",
    title: "Doanh nghiệp nội ghi nhận doanh thu kỷ lục quý III",
    summary:
      "Biên lợi nhuận cải thiện nhờ tối ưu chi phí vận hành và kênh bán hàng.",
    cover:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    category: "Kinh doanh",
    publishedAt: "2025-08-17T07:15:00.000Z",
    views: 9900,
    slug: "doanh-thu-ky-luc",
    tags: ["Báo cáo tài chính"],
  },
];

/* ========== Component ========== */
export default function NewsPage() {
  // UI state
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  // Filter + sort
  const filtered = useMemo(() => {
    let data = [...FAKE_NEWS];

    if (q.trim()) {
      const t = q.toLowerCase();
      data = data.filter(
        (n) =>
          n.title.toLowerCase().includes(t) ||
          n.summary.toLowerCase().includes(t) ||
          n.tags.some((tag) => tag.toLowerCase().includes(t))
      );
    }

    if (category) {
      data = data.filter(
        (n) => n.category === (category as NewsItem["category"])
      );
    }

    if (sortBy === "newest") {
      data.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else {
      data.sort((a, b) => b.views - a.views);
    }

    return data;
  }, [q, category, sortBy]);

  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const current = filtered.slice(start, end);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <Layout className="w-full">
        <Content className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Title level={2} className="!mb-2">
              Bản tin hôm nay
            </Title>
            <Space wrap>
              <Input.Search
                placeholder="Tìm kiếm tin tức..."
                allowClear
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="min-w-[240px]"
              />
              <Select
                placeholder="Chuyên mục"
                allowClear
                value={category}
                onChange={(v) => {
                  setCategory(v);
                  setPage(1);
                }}
                style={{ minWidth: 160 }}
              >
                <Option value="Công nghệ">Công nghệ</Option>
                <Option value="Kinh doanh">Kinh doanh</Option>
                <Option value="Thể thao">Thể thao</Option>
                <Option value="Giải trí">Giải trí</Option>
                <Option value="Thời sự">Thời sự</Option>
              </Select>
              <Select
                value={sortBy}
                onChange={(v) => setSortBy(v)}
                style={{ minWidth: 160 }}
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="popular">Phổ biến</Option>
              </Select>
            </Space>
          </div>

          <Divider />

          {/* Grid news */}
          {current.length === 0 ? (
            <Empty description="Không có bài viết phù hợp" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {current.map((n) => (
                <Card
                  key={n.id}
                  hoverable
                  className="rounded-2xl overflow-hidden shadow-sm"
                  cover={
                    n.cover ? (
                      <div className="overflow-hidden">
                        <div className="relative w-full h-64 md:h-96">
                          <Image
                            src={n.cover}
                            alt={n.title}
                            fill
                            sizes="(max-width: 768px) 100vw,
           (max-width: 1200px) 50vw,
           33vw"
                            className="object-cover rounded-lg"
                            priority={false}
                          />
                        </div>
                      </div>
                    ) : null
                  }
                  actions={[
                    <Space key="date">
                      <CalendarOutlined />
                      <span>{formatVNDateTime(n.publishedAt)}</span>
                    </Space>,
                    <Space key="views">
                      <FireOutlined />
                      <span>{n.views.toLocaleString("vi-VN")} lượt xem</span>
                    </Space>,
                  ]}
                >
                  <Space size={8} className="mb-2" wrap>
                    <Tag color="processing">{n.category}</Tag>
                    {n.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </Space>

                  <Title level={4} className="!mb-2 line-clamp-2">
                    <Link href={`/news/${n.slug}`} className="hover:underline">
                      {n.title}
                    </Link>
                  </Title>

                  <Paragraph className="text-gray-600 line-clamp-3 !mb-0">
                    {n.summary}
                  </Paragraph>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filtered.length}
              showSizeChanger={false}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </Content>
      </Layout>
    </div>
  );
}
