"use client";
import { useState } from "react";
import { Image } from "antd";

interface Props {
  images: string[];
}

export default function PostImages({ images }: Props) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Preview group */}
      <Image.PreviewGroup
        preview={{
          visible: previewVisible,
          onVisibleChange: (vis) => setPreviewVisible(vis),
          current: previewIndex,
          onChange: (idx) => setPreviewIndex(idx),
        }}
        items={images} // ✅ Truyền trực tiếp danh sách ảnh
      />

      <div className="mt-3">
        {images.length === 1 && (
          <Image
            src={images[0]}
            alt="post-image-0"
            className="rounded-lg object-cover w-full cursor-pointer"
            style={{ maxHeight: 600, aspectRatio: "16/9" }}
            preview={false}
            onClick={() => {
              setPreviewIndex(0);
              setPreviewVisible(true);
            }}
          />
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-1">
            {images.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`post-image-${idx}`}
                className="rounded-lg object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
                style={{ aspectRatio: "16/9" }}
                preview={false}
                onClick={() => {
                  setPreviewIndex(idx);
                  setPreviewVisible(true);
                }}
              />
            ))}
          </div>
        )}

        {images.length === 3 && (
          <div className="grid grid-cols-2 gap-1">
            <Image
              src={images[0]}
              alt="post-image-0"
              className="rounded-lg object-cover w-full col-span-2 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ aspectRatio: "16/9", maxHeight: 400 }}
              preview={false}
              onClick={() => {
                setPreviewIndex(0);
                setPreviewVisible(true);
              }}
            />
            {images.slice(1, 3).map((url, idx) => (
              <Image
                key={idx + 1}
                src={url}
                alt={`post-image-${idx + 1}`}
                className="rounded-lg object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
                style={{ aspectRatio: "16/9", maxHeight: 200 }}
                preview={false}
                onClick={() => {
                  setPreviewIndex(idx + 1);
                  setPreviewVisible(true);
                }}
              />
            ))}
          </div>
        )}

        {images.length >= 4 && (
          <div className="grid grid-cols-2 gap-1">
            {images.slice(0, 4).map((url, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={url}
                  alt={`post-image-${idx}`}
                  className="rounded-lg object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ aspectRatio: "16/9", maxHeight: 300 }}
                  preview={false}
                  onClick={() => {
                    setPreviewIndex(idx);
                    setPreviewVisible(true);
                  }}
                />
                {idx === 3 && images.length > 4 && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold rounded-lg cursor-pointer hover:bg-opacity-70 transition-opacity"
                    onClick={() => {
                      setPreviewIndex(3);
                      setPreviewVisible(true);
                    }}
                  >
                    +{images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
