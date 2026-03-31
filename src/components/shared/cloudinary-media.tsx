interface CloudinaryMediaProps {
  url: string;
  type?: "image" | "video";
  alt?: string;
  className?: string;
}

export default function CloudinaryMedia({
  url,
  type = "image",
  alt = "",
  className = "",
}: CloudinaryMediaProps) {
  const isVideo =
    type === "video" ||
    /\.(mp4|webm|ogg)$/i.test(url) ||
    url.includes("/video/upload/");

  const optimizedUrl = url.replace(
    "/upload/",
    isVideo ? "/upload/q_auto,f_auto/" : "/upload/f_auto,q_auto/",
  );

  if (isVideo) {
    return (
      <video
        src={optimizedUrl}
        className={className}
        controls
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={optimizedUrl} alt={alt} className={className} loading="lazy" />
  );
}
