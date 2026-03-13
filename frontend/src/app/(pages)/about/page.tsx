import Nav from "../../../../components/nav";
import AboutHeroSection from "../../../../components/about/AboutHeroSection";
import MissionVisionSection from "../../../../components/about/MissionVisionSection";
import FaqHighlightSection from "../../../../components/FaqHighlightSection";
import NewsletterSection from "../../../../components/NewsletterSection";
import ReadyToStartSection from "../../../../components/ReadyToStartSection";
import SiteFooter from "../../../../components/SiteFooter";

const faqItems = [
  {
    question: "How to setup my Taxbridge Account?",
    answer:
      "The process comes easy with direct expression steps, whereby you start by signing up, after sign up, you confirm your email and login.",
  },
  {
    question: "How Can I file my tax?",
    answer:
      "Upload or sync your tax documents, review your summary, then submit with guided support.",
  },
  {
    question: "How do I use the AI-tools?",
    answer:
      "The AI assistant highlights missing fields, suggests deductions, and explains each recommendation.",
  },
  {
    question: "How can I use the Chatbot?",
    answer:
      "Open the in-dashboard chat to reach a tax expert or the AI assistant at any time.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FF] text-[#0B0F1F] pt-20">
      <Nav />

      <AboutHeroSection />
      <MissionVisionSection />
      <FaqHighlightSection items={faqItems} />
      <NewsletterSection />
      <ReadyToStartSection />
      <SiteFooter />
    </main>
  );
}
