"use client";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkModeButton() {
  const { theme, setTheme } = useTheme();
  const handleToggle = () => {
    if (theme === "dark") {
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      {theme === "dark" ? (
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300" />
      ) : (
        <Moon className="h-5 w-5 rotate-180 scale-75 transition-all duration-300" />
      )}
    </Button>
  );
}
