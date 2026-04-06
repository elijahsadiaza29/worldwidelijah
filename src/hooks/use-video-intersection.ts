import { useEffect, useRef } from "react";

export function useVideoIntersection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Ignore play errors (e.g. strict mobile autoplay policies)
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  return videoRef;
}
