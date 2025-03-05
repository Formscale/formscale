import Log from "./log";

export default async function LogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return null;

  return (
    <>
      <Log id={id} />
    </>
  );
}
