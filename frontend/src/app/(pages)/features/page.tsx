import Nav from "../../../../components/nav";
import KeyFeaturesSection from "../../../../components/features/KeyFeaturesSection";
import FeatureHighlightSection from "../../../../components/features/FeatureHighlightSection";
import StepsSection from "../../../../components/features/StepsSection";
import NewsletterSection from "../../../../components/NewsletterSection";
import ReadyToStartSection from "../../../../components/ReadyToStartSection";
import SiteFooter from "../../../../components/SiteFooter";
import PricingBottomSection from "../../../../components/PricingBottomSection";
import MarketingPageShell from "../../../../components/marketing/MarketingPageShell";

const faqs = [
  {
    question: "How to setup my TaxBridge Account?",
    answer:
      "Create your account and verify your email. Then follow the onboarding steps to connect your tax documents, so we can prepare your return accurately.",
  },
  {
    question: "How can I file my taxes?",
    answer:
      "Our guided workflow walks you through each section with smart suggestions; once complete, submit directly through the platform.",
  },
  {
    question: "How do I use the AI tools?",
    answer:
      "Use the AI assistant to classify expenses, summarize documents, and generate draft responses to tax questions.",
  },
  {
    question: "How can I use the Chatbot?",
    answer:
      "Ask the Chatbot for real-time help, status updates, and recommendations throughout your filing journey.",
  },
];

export default function FeaturesPage() {
  return (
    <MarketingPageShell>
      <main className="min-h-screen bg-[#F7F9FF] text-[#0B0F1F] pt-20">
        <Nav />

        <KeyFeaturesSection />
        <FeatureHighlightSection />
        <StepsSection />
        <PricingBottomSection faqs={faqs} />
        <NewsletterSection />
        <ReadyToStartSection />
        <SiteFooter />
      </main>
    </MarketingPageShell>
  );
}
