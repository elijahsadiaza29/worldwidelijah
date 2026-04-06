"use client";

import { Badge } from "@/components/ui/badge";
import { useVideoIntersection } from "@/hooks/use-video-intersection";
import { MapPin } from "lucide-react";

export default function Hero() {
  const videoRef = useVideoIntersection();

  const skills = [
    "Web Development",
    "IT Support",
    "Teaching",
    "Problem Solving",
    "Networking Basics",
    "Cybersecurity",
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* Profile Box */}
      <div className="relative flex flex-col md:flex-row gap-8 p-8 items-start  overflow-hidden">
        {/* Left Column: Video Avatar */}
        <div className="w-full md:w-[42%] flex-shrink-0">
          <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full overflow-hidden">
            <video
              ref={videoRef}
              src="https://res.cloudinary.com/dlhfnz7ro/video/upload/v1774943790/final_memojis_ix6rvh.webm"
              // autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-[1.6] mt-1.5"
            />
          </div>
        </div>

        {/* Right Column: Profile details */}
        <div className="flex-1 flex flex-col gap-6 pt-2">
          <div className="border-b border-zinc-100 dark:border-zinc-900 pb-5">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-serif mb-2">
              Elijah Sadiaza
            </h1>
            <div className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              <MapPin className="h-4 w-4 text-zinc-400" />
              <span className="relative">
                Santa Barbara, Ilocos Region, Philippines
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-zinc-200 dark:bg-zinc-800" />
              </span>
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400 font-light italic max-w-lg">
            &quot;I am a passionate Junior Web Developer who enjoys creating
            engaging and user-friendly web applications. My background in
            information technology and experience in various roles have equipped
            me with a diverse skill set.&quot;
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-black dark:bg-white text-white dark:text-black rounded-lg px-4 py-1.5 text-[11px] font-medium border-0 shadow-sm transition-transform hover:scale-105"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Extended Bio Box */}
      <div className="p-8 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900/50">
        <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          I&apos;m{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Elijah Sadiaza Jr.
          </span>
          , a web developer at{" "}
          <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4">
            Vertex Technology Corporation
          </span>
          . I focus on delivering high-quality work and helping others achieve
          their goals through technology.
        </p>

        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />

        <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          I specialize in{" "}
          <span className="font-mono text-zinc-500 dark:text-zinc-400 text-[12px]">
            HTML, CSS, JavaScript, PHP, and MySQL
          </span>
          . I love coding and exploring the latest tech trends.
        </p>
      </div>
    </div>
  );
}
