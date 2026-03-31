import Button from "@/app/_components/common/Button";

// ── Filter tabs ───────────────────────────────────────────────────────────────
type FilterType = "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED";

interface FilterTabsProps {
  active: FilterType;
  onChange: (f: FilterType) => void;
  counts: Record<FilterType, number>;
}

export default function FilterTabs({
  active,
  onChange,
  counts,
}: FilterTabsProps) {
  const tabs: FilterType[] = ["ALL", "CONFIRMED", "PENDING", "CANCELLED"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition
            ${
              active === tab
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
        >
          {tab}
          {counts[tab] > 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                active === tab
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {counts[tab]}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}
