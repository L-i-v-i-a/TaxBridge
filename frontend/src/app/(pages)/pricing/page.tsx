import Nav from "../../../../components/nav"
import Pricing from "../../../../components/Pricing"
import NewsletterSection from "../../../../components/NewsletterSection";
import SiteFooter from "../../../../components/SiteFooter";
import MarketingPageShell from "../../../../components/marketing/MarketingPageShell";

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <main className="pt-20">
        <Nav/>
        <Pricing/>
        <NewsletterSection/>
        <SiteFooter/>
      </main>
    </MarketingPageShell>
  )
}
