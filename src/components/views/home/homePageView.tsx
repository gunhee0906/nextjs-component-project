// HomeView.tsx
"use client";

import { useEffect } from "react";
import FullPageScroll from "@/components/ui/fullpageScroll";

export default function HomePageView() {
  // 이 페이지에서만 overflow hidden 적용
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.style.overflow = "hidden";
    }

    return () => {
      if (main) {
        main.style.overflow = ""; // 페이지 벗어나면 원복
      }
    };
  }, []);

  return (
    <FullPageScroll>
      {/* Section  1 */}
      <Section bg="bg-blue-500">
        <h1 className="text-6xl font-bold text-white"></h1>
      </Section>

      {/* Section 2 */}
      <Section bg="bg-green-500">
        <h1 className="text-6xl font-bold text-white"></h1>
      </Section>

      {/* Section 3 */}
      <Section bg="bg-purple-500">
        <h1 className="text-6xl font-bold text-white"></h1>
      </Section>
    </FullPageScroll>
  );
}

function Section({ children, bg }: any) {
  return (
    <div className={`h-screen w-full flex items-center justify-center ${bg}`}>
      {children}
    </div>
  );
}
