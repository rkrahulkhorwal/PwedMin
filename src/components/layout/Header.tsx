"use client";

import { Heart } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
              PwedMin
            </h1>
            <p className="text-xs text-muted-foreground">Your Dream Wedding Planner</p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Planning your perfect day</span>
          </div>
        </div>
      </div>
    </header>
  );
}
