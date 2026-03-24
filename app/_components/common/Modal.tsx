import { ReactNode } from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className: string;
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function Modal({
  children,
  isOpen,
  onClose,
  className,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className={className} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

Modal.Header = function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
      <h2 className="text-white font-semibold text-lg">{title}</h2>
      <button
        onClick={onClose}
        aria-label="Close"
        className="text-gray-400 hover:text-white transition"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

Modal.Body = function ModalBody({ children }: { children: ReactNode }) {
  return <div className="px-6 py-5">{children}</div>;
};
