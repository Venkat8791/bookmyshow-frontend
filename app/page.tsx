"use client";

import { Suspense } from "react";

import HomeContent from "./_components/home/HomeContent";

// useSearchParams needs Suspense boundary in Next.js
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
