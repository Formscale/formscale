import Log from "./log";

export default async function LogPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) return null;

  return (
    <>
      <Log id={id} />
    </>
  );
}
