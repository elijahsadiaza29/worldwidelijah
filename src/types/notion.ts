export interface ProjectMedia {
  name: string;
  year: string;
  category: string;
  description: string;
  thumbnail?: string;
  video?: string;
  images?: string[];
  tech: string;
  github?: string;
  liveUrl?: string;
}

export interface PortfolioMedia {
  profilePhoto?: string;
  projects: ProjectMedia[];
}
