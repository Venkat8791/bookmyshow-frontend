"use client";

import { useState, createContext, ReactNode, useContext } from "react";

interface LocationContextType {
  city: string;
  setCity: (city: string) => void;
}

const LocationContext = createContext<LocationContextType | null>(null);
export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState("Hyderabad");
  return (
    <LocationContext.Provider value={{ city, setCity }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
}
