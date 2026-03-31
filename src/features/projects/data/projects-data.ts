import { getPortfolioMedia, ProjectMedia } from "@/lib/getPortfolioContext";

export async function getProjectsFromNotion(): Promise<ProjectMedia[]> {
  const media = await getPortfolioMedia();
  return media.projects;
}
