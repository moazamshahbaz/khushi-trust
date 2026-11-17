"use client";

import { useState } from "react";
import { Check, Copy, Send } from "lucide-react";

export function CopyField({ label, value, copyLabel = "Copy" }: { label: string; value: string; copyLabel?: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brick/20 py-4 last:border-0">
      <div>
        <p className="text-sm text-ivory/60">{label}</p>
        <p className="mt-0.5 text-lg font-semibold text-ivory"><bdi dir="ltr">{value}</bdi></p>
      </div>
      <button
        type="button"
        aria-label={`${copyLabel} ${label}`}
        onClick={() => {
          navigator.clipboard?.writeText(value.replace(/\s/g, ""));
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        }}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-brick/40 transition-colors hover:bg-brick hover:text-ivory"
      >
        {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

type Field = { name: string; label: string; type: string; required?: boolean; placeholder?: string; options?: string[] };

/** No backend exists yet: the form composes a WhatsApp message to the Trust */
export function WhatsAppForm({ fields, submitLabel, whatsapp, heading }: { fields: Field[]; submitLabel: string; whatsapp: string; heading?: string }) {
  const number = whatsapp.replace(/\D/g, "");
  const input = "w-full rounded-xl bg-ivory px-4 py-3 ring-1 ring-mortar outline-none transition focus:ring-2 focus:ring-brick";
  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const lines = fields.map((f) => `${f.label}: ${fd.get(f.name) ?? ""}`).filter((l) => !l.endsWith(": "));
        const text = (heading ? `${heading}\n` : "") + lines.join("\n");
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      }}
    >
      {fields.map((f) => (
        <label key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
          <span className="mb-1.5 block text-sm font-semibold text-kashi-900">
            {f.label} {f.required && <span className="text-brick">*</span>}
          </span>
          {f.type === "textarea" ? (
            <textarea name={f.name} required={f.required} rows={5} className={input} />
          ) : f.type === "select" ? (
            <select name={f.name} required={f.required} defaultValue="" className={input}>
              <option value="" disabled>{f.placeholder}</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input name={f.name} type={f.type} required={f.required} dir={f.type === "email" || f.type === "tel" ? "ltr" : undefined} className={input} />
          )}
        </label>
      ))}
      <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-kashi-900 px-8 py-3.5 font-semibold text-ivory transition-colors hover:bg-kashi-700 sm:col-span-2 sm:justify-self-start">
        <Send className="flip-rtl h-4 w-4" /> {submitLabel}
      </button>
    </form>
  );
}
