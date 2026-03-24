"use client";

import { Suspense } from "react";

import HomeContent from "./_components/home/HomeContent";
import LoadingSpinner from "./_components/common/LoadingSpinner";

// useSearchParams needs Suspense boundary in Next.js
export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}
