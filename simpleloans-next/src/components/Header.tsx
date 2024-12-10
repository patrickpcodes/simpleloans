"use client";
import {
  HomeIcon,
  UsersRound,
  LogOut,
  Database,
  BadgeDollarSign,
} from "lucide-react";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { Button } from "@/components/ui/button";
import { NavButton } from "@/components/NavButton";
import { ModeToggle } from "@/components/ModeToggle";

export function Header() {
  const { user } = useKindeBrowserClient();
  console.log("user", user);
  return (
    <header className="animate-slide bg-background h-12 p-2 border-b sticky top-0 z-20">
      <div className="flex h-8 items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <NavButton href="/home" label="Home" icon={HomeIcon} />

          <Link
            href="/home"
            className="flex justify-center items-center gap-2 ml-0"
            title="Home"
          >
            <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
              Simple Loans
            </h1>
          </Link>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {"Logged in as :" + user?.email || "No User"}
            </span>
          </div>
        )}

        <div className="flex items-center">
          <NavButton href="/seeddata" label="Seed Data" icon={Database} />

          <NavButton href="/loans" label="Loans" icon={BadgeDollarSign} />

          <NavButton href="/customers" label="Customers" icon={UsersRound} />

          <ModeToggle />

          <Button
            variant="ghost"
            size="icon"
            aria-label="LogOut"
            title="LogOut"
            className="rounded-full"
            asChild
          >
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
