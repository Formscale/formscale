import { useError } from "@/providers";
import { Button } from "@formscale/ui/components";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function RefreshButton({ refresh, type }: { refresh: () => void | Promise<void>; type?: string }) {
  const { handleToast } = useError();

  const handleRefresh = async () => {
    await refresh();
    handleToast("success", `Refreshed ${type || "data"}`);
  };

  return (
    <Button size="sm" variant="outline" onClick={handleRefresh}>
      <ReloadIcon />
    </Button>
  );
}
