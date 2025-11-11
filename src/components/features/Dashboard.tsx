"use client";

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
  TrendingUp,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function Dashboard() {
  const weddingDate = new Date("2025-06-15");
  const today = new Date();
  const daysUntilWedding = Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const stats = [
    {
      title: "Days Until Wedding",
      value: daysUntilWedding,
      icon: Calendar,
      description: `${weddingDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
      color: "text-primary",
    },
    {
      title: "Budget Progress",
      value: "$35,000",
      icon: DollarSign,
      description: "70% of $50,000 budget used",
      color: "text-green-600",
    },
    {
      title: "Tasks Completed",
      value: "6/10",
      icon: CheckSquare,
      description: "60% of checklist done",
      color: "text-blue-600",
    },
    {
      title: "Guest RSVPs",
      value: "85/120",
      icon: Users,
      description: "71% confirmed attendance",
      color: "text-purple-600",
    },
  ];

  const recentActivity = [
    {
      action: "Budget item added",
      detail: "DJ Services - $2,500",
      time: "2 hours ago",
      icon: DollarSign,
    },
    {
      action: "Task completed",
      detail: "Book photographer",
      time: "1 day ago",
      icon: CheckSquare,
    },
    {
      action: "Guest RSVP",
      detail: "Sarah Davis accepted invitation",
      time: "2 days ago",
      icon: Users,
    },
    {
      action: "Supplier added",
      detail: "Perfect Moments Photography",
      time: "3 days ago",
      icon: Calendar,
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
                <span className="font-semibold">70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Task Completion</span>
                <span className="font-semibold">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Guest RSVPs</span>
                <span className="font-semibold">71%</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Supplier Bookings</span>
                <span className="font-semibold">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest planning updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
