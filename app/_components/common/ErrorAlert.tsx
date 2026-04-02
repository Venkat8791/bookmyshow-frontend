import Button from "@/app/_components/common/Button";
import Link from "next/link";

interface ErrorAlertProps {
  message: string;
  variant?: "banner" | "page";
  action?:
    | { label: string; onClick: () => void; href?: never }
    | { label: string; href: string; onClick?: never };
}

export default function ErrorAlert({
  message,
  variant = "banner",
  action,
}: ErrorAlertProps) {
  if (variant === "page") {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <p className="text-red-400 mb-4">{message}</p>
        {action &&
          (action.href ? (
            <Link
              href={action.href}
              className="text-gray-400 hover:text-white text-sm transition"
            >
              {action.label}
            </Link>
          ) : (
            <Button
              onClick={action.onClick}
              className="text-gray-400 hover:text-white text-sm transition"
            >
              {action.label}
            </Button>
          ))}
      </div>
    );
  }

  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
      {message}
    </div>
  );
}
