import InfoPage from "../../../../components/InfoPage";
import MarketingPageShell from "../../../../components/marketing/MarketingPageShell";

export default function HelpdeskPage() {
  return (
    <MarketingPageShell>
      <InfoPage
        title="Help Desk"
        description="Browse quick guides, tutorials, and common questions to resolve issues fast."
      />
    </MarketingPageShell>
  );
}
