export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-green-500/10 text-green-400 border-green-500/20",
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    CANCELLED: "bg-gray-700 text-gray-400 border-gray-600",
  };

  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles[status] ?? styles.CANCELLED}`}
    >
      {status}
    </span>
  );
}
