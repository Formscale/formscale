import Submissions from "./submissions";

export default async function SubmissionsPage({ params }: { params: { submissionId: string } }) {
  const { submissionId } = await params;

  return <Submissions id={submissionId} />;
}
