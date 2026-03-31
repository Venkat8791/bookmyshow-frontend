export default function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-500/10 text-green-400 border-green-500/20",
    UNPAID: "bg-red-500/10 text-red-400 border-red-500/20",
    REFUNDED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles[status] ?? styles.UNPAID}`}
    >
      {status}
    </span>
  );
}
