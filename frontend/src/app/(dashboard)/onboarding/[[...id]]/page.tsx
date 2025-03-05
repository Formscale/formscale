import OnboardingContent from "./onboarding";

export default async function OnboardingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <OnboardingContent id={id} />;
}
