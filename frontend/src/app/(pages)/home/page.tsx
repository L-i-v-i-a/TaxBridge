
import FaqHighlightSection from "../../../../components/FaqHighlightSection"
import Hero from "../../../../components/hero"
import Nav from "../../../../components/nav"
import NewsletterSection from "../../../../components/NewsletterSection"
import ReadyToStartSection from "../../../../components/ReadyToStartSection"
import SiteFooter from "../../../../components/SiteFooter"


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
export default function HomePage() {
  return (
    <>
    <div
        className="bg-[#0D23AD] text-white relative overflow-hidden"
        style={{
          backgroundImage: "url(/image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
    <Nav/>
    <Hero/>
    <FaqHighlightSection items={faqItems} />
    <NewsletterSection/>
    <ReadyToStartSection/>
    <SiteFooter/>
    </div>
    </>
  )
}