import Hero from "../../../../components/hero"
import Nav from "../../../../components/nav"
import NewsletterSection from "../../../../components/NewsletterSection"
import ReadyToStartSection from "../../../../components/ReadyToStartSection"
import SiteFooter from "../../../../components/SiteFooter"
import WhoWeAre from "../../../../components/features/whoWeAre"
import TaskFilling from "../../../../components/features/TaskFilling"
import Homefeatures from "../../../../components/homefeatures"
import PricingBottomSection from "../../../../components/PricingBottomSection"



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

export default function HomePage() {
  return (
    <>
    <div
        className="bg-[#0D23AD] text-white relative overflow-hidden pt-20"
        style={{
          backgroundImage: "url(/image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
    <Nav/>
    <Hero/>
    <WhoWeAre/>
    <TaskFilling/>
    <Homefeatures/>
    <PricingBottomSection faqs={faqs} />
    <NewsletterSection/>
    <ReadyToStartSection/>
    
    <SiteFooter/>
   
    </div>
    </>
  )
}