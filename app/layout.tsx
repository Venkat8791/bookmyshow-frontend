import "./globals.css";
import Navbar from "./_components/common/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <AuthProvider>
          <LocationProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
