"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Props {
  videoId: string;
  src: string;
}

export default function VideoPlayer({ videoId, src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCountedView, setHasCountedView] = useState(false);

  const posterUrl = src
    .replace("/upload/", "/upload/so_5/")
    .replace(/\.\w+$/, ".jpg");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let watchTimer: NodeJS.Timeout;

    const handlePlay = () => {
      if (hasCountedView) return;

      watchTimer = setTimeout(async () => {
        if (!hasCountedView) {
          try {
            await axios.post(`/api/videos/${videoId}/view`);
            setHasCountedView(true);
          } catch (err) {
            console.error("Error counting view:", err);
          }
        }
      }, 10000);
    };

    const handlePauseOrEnded = () => {
      clearTimeout(watchTimer);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePauseOrEnded);
    video.addEventListener("ended", handlePauseOrEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePauseOrEnded);
      video.removeEventListener("ended", handlePauseOrEnded);
      clearTimeout(watchTimer);
    };
  }, [videoId, hasCountedView]);

  return (
    <div className="rounded-lg overflow-hidden shadow">
      <video
        ref={videoRef}
        src={src}
        poster={posterUrl}
        controls
        playsInline
        muted
        loop
        preload="metadata"
        className="w-full h-auto rounded-lg shadow-lg"
      />
    </div>
  );
}
