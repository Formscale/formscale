import DefaultDropdown, { DefaultDropdownProps } from "@/components/default-dropdown";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface DropdownProps extends DefaultDropdownProps {
  title: string;
}

export function Dropdown({ title, items, muted }: DropdownProps) {
  return (
    <DefaultDropdown items={items} muted={muted}>
      <Button variant="outline" className="w-full max-w-64 justify-between">
        <span className="text-xs">{title}</span>
        <ChevronDownIcon />
      </Button>
    </DefaultDropdown>
  );
}
