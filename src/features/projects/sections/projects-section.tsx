import SectionContainer from "@/components/shared/section-container";
import ProjectGrid from "../components/project-grid";

export default function ProjectsSection() {
  return (
    <SectionContainer
      id="projects"
      title="Projects"
      subtitle="A selection of projects I've built — from full-stack platforms to developer tools."
    >
      <ProjectGrid />
    </SectionContainer>
  );
}
