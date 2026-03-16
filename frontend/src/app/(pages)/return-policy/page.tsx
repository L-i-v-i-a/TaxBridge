import InfoPage from "../../../../components/InfoPage";
import MarketingPageShell from "../../../../components/marketing/MarketingPageShell";

export default function ReturnPolicyPage() {
  return (
    <MarketingPageShell>
      <InfoPage
        title="Return Policy"
        description="Understand the guidelines for refunds, cancellations, and service adjustments."
      />
    </MarketingPageShell>
  );
}
