import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";

type AuthMode = "login" | "register";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>("login");

  const handleClose = () => {
    onClose();
    setMode("login");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl"
    >
      <Modal.Header
        onClose={handleClose}
        title={mode === "login" ? "Sign In" : "Create Account"}
      />

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {(["login", "register"] as AuthMode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
            }}
            className={`flex-1 py-3 text-sm font-medium transition
                ${
                  mode === m
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-gray-400 hover:text-white"
                }`}
          >
            {m === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      {/* Form */}
      <Modal.Body>
        {mode === "login" ? (
          <LoginForm onClose={handleClose} />
        ) : (
          <RegisterForm onClose={handleClose} />
        )}
      </Modal.Body>
    </Modal>
  );
}
