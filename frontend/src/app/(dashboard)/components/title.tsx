export default function DashTitle({
  title,
  children,
  indicator,
}: {
  title: string;
  children?: React.ReactNode;
  indicator?: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-between items-start pb-2">
      <div className="flex items-center gap-3">
        {indicator}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
