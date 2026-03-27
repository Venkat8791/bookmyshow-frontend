export default function SeatLegend() {
  return (
    <div className="flex items-center gap-5">
      {[
        { fill: "transparent", border: "#16a34a", label: "Available" },
        { fill: "#16a34a", border: "#4ade80", label: "Selected" },
        { fill: "#374151", border: "#4b5563", label: "Taken" },
        { fill: "#111827", border: "#1f2937", label: "Blocked" },
      ].map(({ fill, border, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded flex-shrink-0"
            style={{ backgroundColor: fill, border: `1.5px solid ${border}` }}
          />
          <span className="text-gray-400 text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}
