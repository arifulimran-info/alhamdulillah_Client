import Hero from "@/components/home/Hero";
import {
  Categories,
  Featured,
  PreorderSection,
  WhyUs,
  HowPreorder,
  Social,
} from "@/components/home/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Featured />
      <PreorderSection />
      <WhyUs />
      <HowPreorder />
      <Social />
    </>
  );
}
