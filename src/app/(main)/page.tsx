import HeroSection from "@/components/HeroSection";
import FeaturedCars from "@/components/FeaturedCars";
import HowItWorks from "@/components/HowItWorks";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCars />
      <HowItWorks />
      <Categories />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <FAQ />
    </main>
  );
}