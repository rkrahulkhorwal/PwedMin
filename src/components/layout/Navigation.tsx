"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  DollarSign,
  CheckSquare,
  Users,
  Calendar,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview of your wedding"
  },
  {
    id: "budget",
    label: "Budget Tracker",
    icon: DollarSign,
    description: "Manage your expenses"
  },
  {
    id: "checklist",
    label: "Checklist",
    icon: CheckSquare,
    description: "Track your tasks"
  },
  {
    id: "suppliers",
    label: "Suppliers",
    icon: Calendar,
    description: "Vendor contacts"
  },
  {
    id: "guests",
    label: "Guest List",
    icon: Users,
    description: "Manage attendees"
  }
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:w-64 md:border-r md:border-b-0">
      <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible p-4 space-x-2 md:space-x-0 md:space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <div className="hidden md:flex md:flex-col md:items-start">
                <span className="text-sm font-medium">{item.label}</span>
                <span className={cn(
                  "text-xs",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
