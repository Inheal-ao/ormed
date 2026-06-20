import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { StatsSection } from "@/components/stats-section";
import { NewsSection } from "@/components/news-section";
import { EventsSection } from "@/components/events-section";
import { BastonariaSection } from "@/components/bastonaria-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { TimelineSection } from "@/components/timeline-section";
import { FAQSection } from "@/components/faq-section";
import { CTASection } from "@/components/cta-section";
import { PartnersSection } from "@/components/partners-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <NewsSection />
      <EventsSection />
      <BastonariaSection />
      <TimelineSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <PartnersSection />
    </>
  );
}
