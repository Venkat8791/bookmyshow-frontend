import { useAuth } from "@/app/context/AuthContext";
import { authService } from "@/app/services/authService";
import { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorAlert from "../common/ErrorAlert";

interface LoginFormProps {
  onClose: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login(loginForm);
      login({ name: res.data.name, email: res.data.email }, res.data.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <ErrorAlert message={error} />}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          value={loginForm.email}
          onChange={(e) =>
            setLoginForm({ ...loginForm, email: e.target.value })
          }
          label="Email"
          id="email"
          placeholder="you@example.com"
          labelClassName="text-gray-400 text-xs mb-1.5 block"
          inputClassName="w-full bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-600"
          required
        />
        <Input
          type="password"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
          label="Password"
          id="password"
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
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </>
  );
}
