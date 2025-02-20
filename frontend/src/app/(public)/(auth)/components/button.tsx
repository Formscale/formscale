import { Button, ButtonProps } from "@/components/ui/button";
import { TriangleRightIcon } from "@radix-ui/react-icons";

export default function AuthButton({ text, props }: { text: string; props?: ButtonProps }) {
  return (
    <Button {...props} type="submit" variant="action" className="w-full font-bold mt-2">
      {text}
      <TriangleRightIcon className="w-4 h-4" />
    </Button>
  );
}
