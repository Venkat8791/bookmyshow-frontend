import { useEffect, useRef, useState } from "react";
import Modal from "../common/Modal";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelect: (city: string) => void;
}

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
];

export default function LocationModal({
  isOpen,
  onClose,
  selectedCity,
  onSelect,
}: LocationModalProps) {
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (!isOpen) {
      return;
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  const filtered = CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl"
    >
      {/* Header */}
      <Modal.Header title="Select your city" onClose={onClose} />

      {/* Search */}
      <div className="px-5 py-3 border-b border-gray-800">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for your city..."
            autoFocus
            className="w-full bg-gray-800 text-white text-sm pl-9 pr-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-500"
          />
        </div>
      </div>

      {/* Cities grid */}
      <div className="p-5 max-h-72 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No cities found
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filtered.map((city) => (
              <button
                key={city}
                onClick={() => {
                  onSelect(city);
                  onClose();
                }}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition
                    ${
                      selectedCity === city
                        ? "bg-red-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
