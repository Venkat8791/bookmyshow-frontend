export default function SeatChip({ label }: { label: string }) {
  return (
    <span className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-lg font-mono">
      {label}
    </span>
  );
}
