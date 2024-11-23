"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const goToCustomers = () => {
    router.push("/customers");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-2xl mb-4">Welcome to Simple Loans</h1>
      <Button onClick={toggleDarkMode} className="mb-4">
        Toggle Dark Mode
      </Button>
      <Button onClick={goToCustomers}>Go to Customer Management</Button>
    </div>
  );
}
