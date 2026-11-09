import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-4 sm:p-5">{children}</div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="my-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      <span className="w-full sm:w-52">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="flex-1 accent-[#185FA5] dark:accent-[#85B7EB]"
      />
      <span className="min-w-11 text-right font-medium text-foreground">
        {value}%
      </span>
    </label>
  );
}

export function Metric({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3">
      <p className="text-[13px] text-muted">{label}</p>
      <b className={`text-xl font-medium ${className}`}>{value}</b>
    </div>
  );
}

export function Metrics({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      {children}
    </div>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-surface px-4 py-3 font-mono text-sm">
      {children}
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-2xl space-y-3 leading-7 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-medium [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  );
}
