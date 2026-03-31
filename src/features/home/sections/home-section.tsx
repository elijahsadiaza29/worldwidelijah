import Hero from "../components/hero";
import Intro from "../components/intro";
import TechStack from "../components/tech-stack";

export default function HomeSection() {
  return (
    <section id="home">
      <Hero />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Intro />
        <TechStack />
      </div>
    </section>
  );
}
