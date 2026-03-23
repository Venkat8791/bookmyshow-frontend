"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LocationSelectorButton from "./LocationSelectorButton";
import UserName from "../usermenus/UserName";
import UserDropDown from "../usermenus/UserDropDown";
import SignInButton from "../usermenus/SignInButton";
import MobileMenuOpen from "../usermenus/MobileMenuOpen";
import MobileMenuClose from "../usermenus/MobileMenuClose";
import SearchBar from "./SearchBar";
import LocationModal from "../modals/LocationModal";
import AuthModal from "../modals/AuthModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [locationOpen, setLocationOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  //close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">
            {/* logo */}
            <Link
              href="/"
              className="text-red-500 font-bold text-xl whitespace-nowrap flex-shrink-0"
            >
              BookMyShow
            </Link>

            {/* Search bar - hidden on mobile */}
            <SearchBar isMobile={false} />

            {/* Right section */}
            <div className="ml-auto flex items-center gap-2 flex-shrink-0">
              {/* Location selector */}
              <LocationSelectorButton
                setLocationOpen={setLocationOpen}
                selectedCity={selectedCity}
                isMobile={false}
              />
              {/*Auth section */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <UserName
                    user={user}
                    userMenuOpen={userMenuOpen}
                    setUserMenuOpen={setUserMenuOpen}
                  />
                  {userMenuOpen && (
                    <UserDropDown
                      user={user}
                      setUserMenuOpen={setUserMenuOpen}
                      handleLogout={handleLogout}
                    />
                  )}
                </div>
              ) : (
                <SignInButton setAuthOpen={setAuthOpen} />
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-gray-400 hover:text-white transition"
              >
                {mobileMenuOpen ? <MobileMenuOpen /> : <MobileMenuClose />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-gray-800 py-3 space-y-2">
              {/* Mobile search */}
              <SearchBar isMobile={true} />

              {/* Mobile location */}
              <LocationSelectorButton
                setLocationOpen={setLocationOpen}
                selectedCity={selectedCity}
                isMobile={true}
              />
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      <LocationModal
        isOpen={locationOpen}
        onClose={() => setLocationOpen(false)}
        selectedCity={selectedCity}
        onSelect={setSelectedCity}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
