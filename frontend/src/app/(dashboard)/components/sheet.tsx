import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export interface DefaultSheetProps<TData extends { id: string }, TValue> {
  trigger: React.ReactNode;
  rowData: TData;
  title: string;
  description: string;
  children: React.ReactNode;
  buttonText?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export default function DefaultSheet<TData extends { id: string }, TValue>({
  trigger,
  rowData,
  title,
  description,
  buttonText = "Save Changes",
  children,
  open,
  setOpen,
}: DefaultSheetProps<TData, TValue>) {
  // console.log("test", rowData);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full max-h-[100vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="-mb-1">{title}</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-1 py-4 w-fit">{children}</div>
        {/* <SheetFooter className="w-full flex justify-start">
          <SheetClose asChild>
          <Button type="submit" className="text-xs font-bold">
            {buttonText}
          </Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}

{
  /* save changes, export submission, copy id, send email */
}
