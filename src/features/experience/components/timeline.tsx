import { experienceData } from "../data/experience-data";
import TimelineItem from "./timeline-item";

export default function Timeline() {
  return (
    <div className="mx-auto max-w-3xl">
      {experienceData.map((experience, index) => (
        <TimelineItem key={index} experience={experience} index={index} />
      ))}
    </div>
  );
}
