import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import HowItWorks from "@/components/site/HowItWorks";
import InGameSection from "@/components/site/InGameSection";
import GalleryCarousel from "@/components/site/GalleryCarousel";
import AddonsShowcase from "@/components/site/AddonsShowcase";
import TshirtSection from "@/components/site/TshirtSection";
import Pricing from "@/components/site/Pricing";
import Testimonials from "@/components/site/Testimonials";
import Faq from "@/components/site/Faq";
import CtaBand from "@/components/site/CtaBand";
import Footer from "@/components/site/Footer";

const TICKER = [
  "Solo",
  "Squad",
  "Cigars",
  "Baddies",
  "Exotic cars",
  "Your city",
  "Gold & ice",
  "Neon nights",
  "Premium tees",
  "Loading screen",
];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        <div className="relative border-y border-white/10 bg-noir-800/40 py-4">
          <Marquee items={TICKER} />
        </div>

        <HowItWorks />
        <InGameSection />
        <GalleryCarousel />
        <AddonsShowcase />
        <TshirtSection />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
