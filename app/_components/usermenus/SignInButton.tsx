interface SignInButtonProps {
  setAuthOpen: (value: boolean) => void;
}
export default function SignInButton({ setAuthOpen }: SignInButtonProps) {
  return (
    <button
      onClick={() => setAuthOpen(true)}
      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition whitespace-nowrap"
    >
      Sign In
    </button>
  );
}
