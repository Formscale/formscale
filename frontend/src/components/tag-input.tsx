import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
  field: {
    value: string[];
    onChange: (value: string[]) => void;
  };
  placeholder: string;
}

export default function TagInput({ field, placeholder }: TagInputProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-start rounded-md border border-input bg-transparent px-3 py-0 text-xs shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
      {Array.isArray(field.value) &&
        field.value.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1 font-normal text-xs py-1">
            {tag}
            <button type="button" onClick={() => field.onChange(field.value.filter((t: string) => t !== tag))}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      <Input
        type="text"
        placeholder={placeholder}
        className="border-0 focus-visible:ring-0 p-0 shadow-none flex-1 min-w-[100px]"
        onBlur={(e) => {
          const value = e.currentTarget.value.trim();
          if (value) {
            field.onChange([...(Array.isArray(field.value) ? field.value : []), value]);
            e.currentTarget.value = "";
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value) {
              field.onChange([...field.value, value]);
              e.currentTarget.value = "";
            }
          }
        }}
      />
    </div>
  );
}
