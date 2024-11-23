"use client";

// import type { Metadata } from "next";
import "./globals.css";
import React, { useState, createContext, useContext } from "react";
import Toolbar from "@/components/Toolbar";
import { Toaster } from "@/components/ui/toaster";

const TitleContext = createContext({
  title: "Simple Loans",
  setTitle: (title: string) => {},
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState("Simple Loans");

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
        <TitleContext.Provider value={{ title, setTitle }}>
          <Toolbar title={title} toggleDarkMode={toggleDarkMode} />
          {children}
          <Toaster />
        </TitleContext.Provider>
      </body>
    </html>
  );
}

export const useTitle = () => useContext(TitleContext);
