"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  DollarSign,
  CheckSquare,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function Dashboard() {
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [guestsAccepted, setGuestsAccepted] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("wedding_date, total_budget")
        .eq("id", user!.id)
        .single();

      if (profile) {
        if (profile.wedding_date) {
          setWeddingDate(new Date(profile.wedding_date));
        }
        setTotalBudget(Number(profile.total_budget) || 0);
      }

      // Fetch budget items
      const { data: budgetItems } = await supabase
        .from("budget_items")
        .select("amount")
        .eq("user_id", user!.id);

      if (budgetItems) {
        const spent = budgetItems.reduce((sum, item) => sum + Number(item.amount), 0);
        setTotalSpent(spent);
      }

      // Fetch checklist items
      const { data: checklistItems } = await supabase
        .from("checklist_items")
        .select("completed")
        .eq("user_id", user!.id);

      if (checklistItems) {
        setTotalTasks(checklistItems.length);
        setTasksCompleted(checklistItems.filter((item) => item.completed).length);
      }

      // Fetch guests
      const { data: guests } = await supabase
        .from("guests")
        .select("rsvp_status, plus_one")
        .eq("user_id", user!.id);

      if (guests) {
        const total = guests.reduce((sum, guest) => sum + (guest.plus_one ? 2 : 1), 0);
        const accepted = guests
          .filter((g) => g.rsvp_status === "accepted")
          .reduce((sum, guest) => sum + (guest.plus_one ? 2 : 1), 0);
        setTotalGuests(total);
        setGuestsAccepted(accepted);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const today = new Date();
  const daysUntilWedding = weddingDate
    ? Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const tasksPercentage = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;
  const guestsPercentage = totalGuests > 0 ? (guestsAccepted / totalGuests) * 100 : 0;

  const stats = [
    {
      title: "Days Until Wedding",
      value: daysUntilWedding !== null ? daysUntilWedding : "Not set",
      icon: Calendar,
      description: weddingDate
        ? weddingDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Set your wedding date in profile",
      color: "text-primary",
    },
    {
      title: "Budget Progress",
      value: `$${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      description: `${budgetPercentage.toFixed(0)}% of $${totalBudget.toLocaleString()} budget used`,
      color: "text-green-600",
    },
    {
      title: "Tasks Completed",
      value: `${tasksCompleted}/${totalTasks}`,
      icon: CheckSquare,
      description: `${tasksPercentage.toFixed(0)}% of checklist done`,
      color: "text-blue-600",
    },
    {
      title: "Guest RSVPs",
      value: `${guestsAccepted}/${totalGuests}`,
      icon: Users,
      description: `${guestsPercentage.toFixed(0)}% confirmed attendance`,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to Your Wedding Dashboard
          </h2>
          <p className="text-muted-foreground">
            Everything you need to plan your perfect day
          </p>
        </div>
        <Heart className="h-12 w-12 text-primary" fill="currentColor" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wedding Countdown</CardTitle>
            <CardDescription>Time until your special day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysUntilWedding !== null ? (
              <>
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {daysUntilWedding}
                  </div>
                  <p className="text-xl text-muted-foreground">days to go</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center pt-4">
                  <div>
                    <div className="text-2xl font-semibold">
                      {Math.floor(daysUntilWedding / 7)}
                    </div>
                    <div className="text-xs text-muted-foreground">weeks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">
                      {Math.floor(daysUntilWedding / 30)}
                    </div>
                    <div className="text-xs text-muted-foreground">months</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">
                      {Math.floor(daysUntilWedding / 7) % 4}
                    </div>
                    <div className="text-xs text-muted-foreground">weeks left</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Set your wedding date to see the countdown
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planning Progress</CardTitle>
            <CardDescription>Overall completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Budget Planning</span>
                <span className="font-semibold">{budgetPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Task Completion</span>
                <span className="font-semibold">{tasksPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={tasksPercentage} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Guest RSVPs</span>
                <span className="font-semibold">{guestsPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={guestsPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/20">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Your Wedding Journey Starts Here
            </h3>
            <p className="text-muted-foreground">
              Stay organized, reduce stress, and enjoy planning your perfect day
            </p>
          </div>
          <Heart className="h-16 w-16 text-primary opacity-50" fill="currentColor" />
        </CardContent>
      </Card>
    </div>
  );
}
