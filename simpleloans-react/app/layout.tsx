"use client";

// import type { Metadata } from "next";
import "./globals.css";
import React, { useState } from "react";
import Toolbar from "@/components/Toolbar";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <html lang="en">
      <body>
        <Toolbar title={"Simple Loans"} toggleDarkMode={toggleDarkMode} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
