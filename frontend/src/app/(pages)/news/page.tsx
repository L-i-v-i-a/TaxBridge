import InfoPage from "../../../../components/InfoPage";
import MarketingPageShell from "../../../../components/marketing/MarketingPageShell";

export default function NewsPage() {
  return (
    <MarketingPageShell>
      <InfoPage
        title="News"
        description="Stay up to date with Taxbridge product announcements, partnerships, and company updates."
      />
    </MarketingPageShell>
  );
}
