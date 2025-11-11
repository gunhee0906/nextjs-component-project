"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
export default function FullPageScroll({ children }: { children: any }) {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const totalSections = children.length;

  useEffect(() => {
    const handleWheel = (e: any) => {
      setIsScrolling(true);

      if (e.deltaY > 0) {
        setCurrentSection((prev: any) =>
          prev < totalSections - 1 ? prev + 1 : prev
        );
      } else {
        setCurrentSection((prev: any) => (prev > 0 ? prev - 1 : prev));
      }

      setTimeout(() => setIsScrolling(false), 1000);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isScrolling, totalSections]);
  return (
    <>
      <div className="h-screen overflow-hidden relative">
        <motion.div
          animate={{ y: `-${currentSection * 100}vh` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {children}
        </motion.div>

        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`block w-3 h-3 rounded-full my-2 transition-all ${
                currentSection === index
                  ? "bg-blue-500 scale-125"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
