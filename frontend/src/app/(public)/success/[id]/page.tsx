export default async function SuccessPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  console.log(id);

  return <div>Success</div>;
}
