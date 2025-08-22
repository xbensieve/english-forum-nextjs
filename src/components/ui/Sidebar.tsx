"use client";
import { MenuOutlined } from "@ant-design/icons";
import { Layout, Menu, Drawer } from "antd";
import { CircleArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
const { Sider } = Layout;

interface SidebarProps {
  defaultSelected?: string;
}

export default function Sidebar({
  defaultSelected = "trending",
}: SidebarProps) {
  const [selectedKey, setSelectedKey] = useState(defaultSelected);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Swipe handler
  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (isMobile) {
        setVisible(true);
      }
    },
    trackMouse: true,
    delta: 50,
  });

  const handleClick = (e: { key: string }) => {
    setSelectedKey(e.key);
    if (isMobile) {
      setVisible(false);
    }
  };

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  const menuItems = [
    { key: "favourite", label: "Favourite" },
    { key: "hot", label: "Nổi bật" },
    { key: "trending", label: "Trending" },
  ];

  return (
    <>
      {isMobile ? (
        <>
          <div
            {...handlers}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 30,
              height: "100vh",
              zIndex: 2,
              background: "transparent",
            }}
          >
            <div
              onClick={toggleDrawer}
              style={{
                position: "absolute",
                top: "15%",
                left: 2,
                width: 40,
                height: 40,
                background: "#722ed1",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
                transform: "translateY(-50%)",
              }}
              role="button"
              aria-label="Toggle menu"
            >
              <CircleArrowRight style={{ color: "#fff", fontSize: "20px" }} />
            </div>
          </div>
          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setVisible(false)}
            open={visible}
            width={200}
            styles={{ body: { padding: 0 } }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={handleClick}
              style={{ height: "100%", borderRight: 0 }}
              items={menuItems}
            />
          </Drawer>
        </>
      ) : (
        <Sider
          width={200}
          style={{
            position: "fixed",
            top: 64,
            bottom: 0,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            zIndex: 1,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleClick}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
      )}
    </>
  );
}
