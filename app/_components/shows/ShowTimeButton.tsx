import Button from "../common/Button";

interface ShowTimeButtonProps {
  show: { showId: string; showTime: string; status: string };
  onClick: () => void;
}

export default function ShowTimeButton({ show, onClick }: ShowTimeButtonProps) {
  const isAvailable = show.status === "ACTIVE";
  return (
    <Button
      onClick={onClick}
      disabled={!isAvailable}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition
                ${
                  isAvailable
                    ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                    : "border-gray-700 text-gray-600 cursor-not-allowed"
                }`}
    >
      {show.showTime}
    </Button>
  );
}
