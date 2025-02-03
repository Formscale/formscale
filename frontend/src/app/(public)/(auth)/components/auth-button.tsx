import { Button } from "@/components/ui/button";
import { TriangleRightIcon } from "@radix-ui/react-icons";

export default function AuthButton({ text }: { text: string }) {
  return (
    <Button type="submit" variant="action" className="w-full font-bold mt-2">
      {text}
      <TriangleRightIcon className="w-4 h-4" />
    </Button>
  );
}
