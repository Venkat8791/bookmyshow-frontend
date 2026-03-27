import Button from "./Button";

interface LocationSelectorButtonProps {
  setLocationOpen: (value: boolean) => void;
  selectedCity: string;
  isMobile: boolean;
}

export default function LocationSelectorButton({
  setLocationOpen,
  selectedCity,
  isMobile,
}: LocationSelectorButtonProps) {
  return (
    <Button
      onClick={() => setLocationOpen(true)}
      className={`${isMobile ? "flex gap-2 w-full py-2.5" : "hidden sm:flex gap-1.5 py-2"} items-center  text-gray-300 hover:text-white text-sm px-3 rounded-lg hover:bg-gray-800 transition`}
    >
      <svg
        className={`${isMobile ? "flex-shrink-0" : ""} w-4 h-4 text-red-400 `}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
      <span className="max-w-[80px] truncate">{selectedCity}</span>
      <svg
        className="w-3 h-3 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </Button>
  );
}
