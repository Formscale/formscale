import DashTitle from "../components/dash-title";
import { DashCardSkeleton } from "../components/dash-card";

export default function FormsPage() {
  return (
    <>
      <DashTitle title="Metrics" />
      <DashCardSkeleton></DashCardSkeleton>
    </>
  );
}
