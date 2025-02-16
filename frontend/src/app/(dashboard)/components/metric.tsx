interface MetricProps {
  value: number;
  range?: string;
}

export default function Metric({ value, range }: MetricProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Total submissions{range && ` (${range})`}</span>
      <span className="text-xl font-bold">{value.toLocaleString()}</span>
    </div>
  );
}
