import { Bookmark, Earth, Newspaper, Sparkles } from "lucide-react";

export type FeedTab = "feed" | "myPosts" | "community" | "saved";

export const FEED_TABS = [
  { id: "feed", label: "Feed", Icon: Newspaper },
  { id: "myPosts", label: "My Posts", Icon: Sparkles },
  { id: "community", label: "Community", Icon: Earth },
  { id: "saved", label: "Saved", Icon: Bookmark },
] as const;

export default function Sidebar({
  active,
  onChange,
}: {
  active: FeedTab;
  onChange: (tab: FeedTab) => void;
}) {
  return (
    <aside className="hidden h-fit space-y-3 xl:sticky xl:top-[84px] xl:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {FEED_TABS.map(({ id, label, Icon }, i) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition ${
              i > 0 ? "mt-1" : ""
            } ${
              active === id
                ? "bg-[#e7f3ff] text-[#1877f2]"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}