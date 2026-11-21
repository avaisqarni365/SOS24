import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import { applyLinks, type JobRole } from "@/data/jobs";

/** WhatsApp, phone and e-mail, each prefilled with the job (and town) the applicant means. */
export function ApplyButtons({ what, town }: { what: string; town?: string }) {
  const a = applyLinks(what, town);
  return (
    <div className="flex flex-wrap gap-3">
      <a href={a.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 text-sm font-bold shadow-xs transition-colors">
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Per WhatsApp bewerben
      </a>
      <a href={a.tel} className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-line/20 bg-surface px-6 text-sm font-semibold text-ink hover:border-accent-deep transition-colors">
        <Phone className="h-4 w-4" aria-hidden="true" />
        {COMPANY_INFO.phoneDisplay}
      </a>
      <a href={a.mail} className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-line/20 bg-surface px-6 text-sm font-semibold text-ink hover:border-accent-deep transition-colors">
        <Mail className="h-4 w-4" aria-hidden="true" />
        Per E-Mail bewerben
      </a>
    </div>
  );
}

export function Chips({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((k) => (
        <li key={k} className="rounded-full border border-line/15 bg-surface px-3 py-1 text-xs font-semibold text-ink">
          {k}
        </li>
      ))}
    </ul>
  );
}

/** One role as a card: what it is, the requirements, and the way to the full ad. */
export function RoleCard({ role, town, heading: H = "h3" }: { role: JobRole; town?: string; heading?: "h2" | "h3" }) {
  return (
    <li id={role.slug} className="scroll-mt-28 flex flex-col rounded-3xl border border-line/12 bg-surface p-6 shadow-sm">
      <p className="sc-label text-accent-deep font-bold">{role.employment}</p>
      <H className="mt-2 text-xl font-bold text-ink">{town ? `${role.short} in ${town} (m/w/d)` : role.title}</H>
      <p className="mt-3 text-sm leading-relaxed text-ink font-medium">{town ? role.inTown.replace("{stadt}", town) : role.lede}</p>
      <p className="mt-4 text-sm font-bold text-ink">Das sollten Sie mitbringen</p>
      <ul className="mt-2 flex-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink font-medium">
        {role.requirements.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <div className="mt-4">
        <Chips items={role.keywords} label="Suchbegriffe zu dieser Stelle" />
      </div>
      <a href={`/jobs/${role.slug}/`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep hover:underline underline-offset-4">
        Stellenangebot {role.short}: Aufgaben und Bewerbung <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </li>
  );
}
