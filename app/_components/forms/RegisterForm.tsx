import { useAuth } from "@/app/context/AuthContext";
import { authService } from "@/app/services/authService";
import { useState } from "react";

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
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">
            Full Name
          </label>
          <input
            type="text"
            value={registerForm.name}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, name: e.target.value })
            }
            placeholder="John Doe"
            required
            className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Email</label>
          <input
            type="email"
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, email: e.target.value })
            }
            placeholder="you@example.com"
            required
            className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Phone</label>
          <input
            type="tel"
            value={registerForm.phone}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, phone: e.target.value })
            }
            placeholder="9876543210"
            required
            className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Password</label>
          <input
            type="password"
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm({
                ...registerForm,
                password: e.target.value,
              })
            }
            placeholder="••••••••"
            required
            className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">
            Confirm Password
          </label>
          <input
            type="password"
            value={registerForm.confirmPassword}
            onChange={(e) =>
              setRegisterForm({
                ...registerForm,
                confirmPassword: e.target.value,
              })
            }
            placeholder="••••••••"
            required
            className="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition mt-2"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </>
  );
}
