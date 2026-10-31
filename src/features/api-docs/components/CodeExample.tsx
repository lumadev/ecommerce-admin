import CopyButton from "./CopyButton";

interface CodeExampleProps {
  title: string;
  value: string;
  label: string;
  variant: "request" | "response";
}

const CodeExample = ({ title, value, label, variant }: CodeExampleProps) => (
  <section className="min-w-0">
    <div className="mb-2 flex items-center justify-between gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <CopyButton value={value} label={label} />
    </div>
    <pre
      className={
        variant === "request"
          ? "max-h-96 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-emerald-100 shadow-inner"
          : "max-h-96 overflow-auto rounded-lg border border-border bg-muted/70 p-4 text-xs leading-5 text-foreground"
      }
    >
      <code>{value}</code>
    </pre>
  </section>
);

export default CodeExample;
