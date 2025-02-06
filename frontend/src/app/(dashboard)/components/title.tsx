export default function DashTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="w-full flex justify-between items-center pb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
