export function formatDateLabel(date: Date, index: number): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}
