import React from "react";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  title: string;
  toggleDarkMode: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ title, toggleDarkMode }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-xl">{title}</div>
      <Button onClick={toggleDarkMode}>Toggle Dark Mode</Button>
    </div>
  );
};

export default Toolbar;
