import Button from "@/app/_components/common/Button";
import Link from "next/link";

type Variant = "success" | "expired" | "cancelled";

interface StatusCardProps {
  variant: Variant;
  title: string;
  description: string;
  action?:
    | { label: string; onClick: () => void; href?: never }
    | { label: string; href: string; onClick?: never };
}

const variantConfig: Record<
  Variant,
  { containerClass: string; iconClass: string; iconPath: string }
> = {
  success: {
    containerClass: "bg-green-500/10 border border-green-500/30",
    iconClass: "text-green-500",
    iconPath: "M5 13l4 4L19 7",
  },
  expired: {
    containerClass: "bg-red-500/10 border border-red-500/30",
    iconClass: "text-red-500",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  cancelled: {
    containerClass: "bg-gray-800",
    iconClass: "text-gray-500",
    iconPath: "M6 18L18 6M6 6l12 12",
  },
};

export default function StatusCard({
  variant,
  title,
  description,
  action,
}: StatusCardProps) {
  const { containerClass, iconClass, iconPath } = variantConfig[variant];

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`w-16 h-16 ${containerClass} rounded-full flex items-center justify-center mb-4`}
      >
        <svg
          className={`w-8 h-8 ${iconClass}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
      </div>

      <h1 className="text-white text-xl font-bold mb-2">{title}</h1>
      <p className="text-gray-400 text-sm mb-6">{description}</p>

      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-8 py-3 rounded-xl transition"
          >
            {action.label}
          </Link>
        ) : (
          <Button
            onClick={action.onClick}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-8 py-3 rounded-xl transition"
          >
            {action.label}
          </Button>
        ))}
    </div>
  );
}
