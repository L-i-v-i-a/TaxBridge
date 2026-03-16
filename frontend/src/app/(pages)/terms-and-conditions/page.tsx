import InfoPage from "../../../../components/InfoPage";
import MarketingPageShell from "../../../../components/marketing/MarketingPageShell";

export default function TermsAndConditionsPage() {
  return (
    <MarketingPageShell>
      <InfoPage
        title="Terms & Conditions"
        description="Review the rules and guidelines that govern the use of the Taxbridge platform."
      />
    </MarketingPageShell>
  );
}
