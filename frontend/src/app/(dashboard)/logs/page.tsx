import { LogsProvider } from "../../../providers/logs";
import DashTitle from "../components/title";

export default function LogsPage() {
  return (
    <LogsProvider>
      <DashTitle title="Logs" />
      {/* <DashCard title="Logs coming soon." description="Monitor submissions, webhooks, emails, and more."></DashCard> */}
    </LogsProvider>
  );
}
