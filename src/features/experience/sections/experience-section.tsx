import SectionContainer from "@/components/shared/section-container";
import Timeline from "../components/timeline";

export default function ExperienceSection() {
  return (
    <SectionContainer
      id="experience"
      title="Experience"
      subtitle="My professional journey and the impact I've made along the way."
    >
      <Timeline />
    </SectionContainer>
  );
}
