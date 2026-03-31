export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
  achievements: string[];
  logo?: string;
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  github?: string;
  liveUrl?: string;
  image?: string;
  thumbnail: string;
  video?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
