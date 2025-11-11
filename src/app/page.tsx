"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Dashboard } from "@/components/features/Dashboard";
import { BudgetTracker } from "@/components/features/BudgetTracker";
import { WeddingChecklist } from "@/components/features/WeddingChecklist";
import { SupplierList } from "@/components/features/SupplierList";
import { GuestList } from "@/components/features/GuestList";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "budget":
        return <BudgetTracker />;
      case "checklist":
        return <WeddingChecklist />;
      case "suppliers":
        return <SupplierList />;
      case "guests":
        return <GuestList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Header />
        <div className="flex flex-1 flex-col md:flex-row">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
