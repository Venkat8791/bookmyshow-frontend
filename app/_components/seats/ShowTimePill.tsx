import Button from "../common/Button";

interface ShowTimePillProps {
  time: string;
  isActive: boolean;
  onClick: () => void;
}
export default function ShowTimePill({
  time,
  isActive,
  onClick,
}: ShowTimePillProps) {
  return (
    <Button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition
        ${
          isActive
            ? "bg-red-500 border-red-500 text-white"
            : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
        }`}
    >
      {time}
    </Button>
  );
}
