import Button from "../common/Button";

interface ShowTimeButtonProps {
  show: { showId: string; showTime: string; status: string };
  screenType: string;
  onClick: () => void;
}

export default function ShowTimeButton({ show, screenType, onClick }: ShowTimeButtonProps) {
  const isAvailable = show.status === "ACTIVE";
  return (
    <Button
      onClick={onClick}
      disabled={!isAvailable}
      className={`flex flex-col items-center px-4 py-2 rounded-lg text-sm font-medium border transition
                ${
                  isAvailable
                    ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                    : "border-gray-700 text-gray-600 cursor-not-allowed"
                }`}
    >
      {show.showTime}
      <span className="text-[10px] font-normal mt-0.5 opacity-70">{screenType}</span>
    </Button>
  );
}
