import Navbar from "@/components/Navbar";
import HeroCanvas from "@/components/HeroCanvas";
import PowertrainSpecs from "@/components/PowertrainSpecs";
import AeroEngineering from "@/components/AeroEngineering";
import InteriorSection from "@/components/InteriorSection";
import Timeline from "@/components/Timeline";
import Gallery from "@/components/Gallery";
import InquiryCTA from "@/components/InquiryCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative bg-carbon">
        {/* 01 — Pinned 240-frame scroll sequence */}
        <HeroCanvas />

        {/* Content rides over the end of the pinned hero */}
        <div className="relative z-10 bg-carbon">
          <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-papaya/60 to-transparent" />
          <PowertrainSpecs />
          <AeroEngineering />
          <InteriorSection />
          <Timeline />
          <Gallery />
          <InquiryCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
