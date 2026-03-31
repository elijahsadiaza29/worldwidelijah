import { getProjectsFromNotion } from "../data/projects-data";
import { ProjectMedia } from "@/lib/getPortfolioContext";
import { ProjectCard } from "./project-card";

export default async function ProjectGrid() {
  // Fetch live from Notion → Cloudinary
  const projects = await getProjectsFromNotion();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.length === 0 ? (
        <p className="col-span-3 text-center text-sm text-muted-foreground py-12">
          No projects found. Add them to your Notion page!
        </p>
      ) : (
        projects.map((project, index) => (
          <ProjectCard 
            key={`${project.name}-${index}`} 
            project={project as ProjectMedia} 
            onClick={() => {}}
            width="100%"
          />
        ))
      )}
    </div>
  );
}
