import InfoPage from "../../../../components/InfoPage";
import MarketingPageShell from "../../../../components/marketing/MarketingPageShell";

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageShell>
      <InfoPage
        title="Privacy Policy"
        description="Learn how Taxbridge collects, uses, and protects your personal and tax data."
      />
    </MarketingPageShell>
  );
}
