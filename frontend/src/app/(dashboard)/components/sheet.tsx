import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function DefaultSheet<TData extends { id: string }, TValue>({
  trigger,
  rowData,
  title,
  description,
  buttonText = "Save Changes",
  children,
}: {
  trigger: React.ReactNode;
  rowData: TData;
  title: string;
  description: string;
  children: React.ReactNode;
  buttonText?: string;
}) {
  console.log("test", rowData);

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="-mb-1">{title}</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 py-4">{children}</div>
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
