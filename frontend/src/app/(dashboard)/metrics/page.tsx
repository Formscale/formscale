import DashTitle from "../components/title";
import { DashCardSkeleton } from "../components/card";

export default function FormsPage() {
  return (
    <>
      <DashTitle title="Metrics" />
      <DashCardSkeleton></DashCardSkeleton>
    </>
  );
}
