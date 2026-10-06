import HeroSection from "@/components/HeroSection";
import FeaturedCars from "@/components/FeaturedCars";
import HowItWorks from "@/components/HowItWorks";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import EnvironmentalImpact from "@/components/EnvironmentalImpact";
import ReviewsSection from "@/components/ReviewsSection";
import FAQ from "@/components/FAQ";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCars />
      <HowItWorks />
      <Categories />
      <WhyChooseUs />
      <EnvironmentalImpact />
      <ReviewsSection />
      <FAQ />
    </main>
  );
}