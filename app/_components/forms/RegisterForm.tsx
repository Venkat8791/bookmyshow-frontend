import { useAuth } from "@/app/context/AuthContext";
import { authService } from "@/app/services/authService";
import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorAlert from "../common/ErrorAlert";

interface RegisterFormProps {
  onClose: () => void;
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register(registerForm);
      login({ name: res.data.name, email: res.data.email }, res.data.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <ErrorAlert message={error} />}
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="text"
          value={registerForm.name}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, name: e.target.value })
          }
          label="Full Name"
          id="name"
          placeholder="John Doe"
          labelClassName="text-gray-400 text-xs mb-1.5 block"
          inputClassName="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          required
        />
        <Input
          type="email"
          value={registerForm.email}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, email: e.target.value })
          }
          label="Email"
          id="email"
          placeholder="you@example.com"
          labelClassName="text-gray-400 text-xs mb-1.5 block"
          inputClassName="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          required
        />
        <Input
          type="tel"
          value={registerForm.phone}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, phone: e.target.value })
          }
          label="Phone"
          id="phone"
          placeholder="9876543210"
          labelClassName="text-gray-400 text-xs mb-1.5 block"
          inputClassName="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          required
        />
        <Input
          type="password"
          value={registerForm.password}
          onChange={(e) =>
            setRegisterForm({
              ...registerForm,
              password: e.target.value,
            })
          }
          label="Password"
          id="password"
          placeholder="••••••••"
          labelClassName="text-gray-400 text-xs mb-1.5 block"
          inputClassName="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          required
        />
        <Input
          type="password"
          value={registerForm.confirmPassword}
          onChange={(e) =>
            setRegisterForm({
              ...registerForm,
              confirmPassword: e.target.value,
            })
          }
          label="Confirm Password"
          id="confirmPassword"
          placeholder="••••••••"
          labelClassName="text-gray-400 text-xs mb-1.5 block"
          inputClassName="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition mt-2"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </>
  );
}
