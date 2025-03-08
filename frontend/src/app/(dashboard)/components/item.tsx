import { Button } from "@formscale/ui/components";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { DefaultDropdownItem, DropdownItem, DropdownSkeleton } from "@/components/default-dropdown";

interface ItemProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  dropdownItems?: DefaultDropdownItem[];
  onClick?: () => void;
  button?: boolean;
  children?: React.ReactNode;
}

function Wrapper({ children, onClick, button }: { children: React.ReactNode; onClick?: () => void; button?: boolean }) {
  if (button && onClick) {
    return (
      <Button variant="ghost" className="w-full justify-start h-auto px-2 -ml-2 py-1" onClick={onClick}>
        {children}
      </Button>
    );
  }

  return <div className="flex justify-between items-center w-full py-2">{children}</div>;
}

export default function Item({ title, icon: Icon, description, dropdownItems, onClick, button }: ItemProps) {
  return (
    <Wrapper onClick={onClick} button={button}>
      <div className="flex justify-start items-center gap-4 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <div className="flex flex-col items-start justify-center gap-1">
          <span className="text-xs font-bold text-foreground">{title}</span>
          {description && <span className="text-xs">{description}</span>}
        </div>
      </div>
      {!button && dropdownItems && (
        <DropdownSkeleton
          button={
            <Button variant="ghost" size="icon" className="p-0">
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          }
        >
          {dropdownItems.map((item) => (
            <DropdownItem key={item.title} item={item} />
          ))}
        </DropdownSkeleton>
      )}
    </Wrapper>
  );
}
