import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { MissionSection, ObjectivesSection, WhySection, VisionSection } from "@/components/Sections";
import PillarsSection from "@/components/PillarsSection";
import ReportsSection from "@/components/ReportsSection";
import FounderSection from "@/components/FounderSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <MissionSection />
      <PillarsSection />
      <ObjectivesSection />
      <WhySection />
      <VisionSection />
      <ReportsSection />
      <FounderSection />
      <Footer />
    </div>
  );
};

export default Index;
