import { useState, KeyboardEvent } from "react";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  value: string[];
  onChange: (hashtags: string[]) => void;
}

const HashtagsField = ({ value, onChange }: Props) => {
  const [input, setInput] = useState("");

  const add = (raw: string) => {
    const tag = raw.trim().replace(/,/g, ""); // remove commas
    if (!tag) return;

    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const remove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add(input);
    } else if (e.key === ",") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="cat-hashtags" className="text-sm font-medium">
        Hashtags
        <span className="ml-1 text-xs font-normal text-muted-foreground">(opcional)</span>
      </Label>
      <div className="flex min-h-10 flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="rounded-sm opacity-70 hover:opacity-100"
              aria-label={`Remover ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          id="cat-hashtags"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => add(input)}
          placeholder={value.length === 0 ? "Ex: minimalismo, decoração — Enter para adicionar" : ""}
          className="min-w-[180px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
};

export default HashtagsField;
