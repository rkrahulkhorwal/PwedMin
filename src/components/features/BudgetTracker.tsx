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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, TrendingUp, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/types/database.types";

type BudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];

export function BudgetTracker() {
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBudgetData();
    }
  }, [user]);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);

      // Fetch profile for total budget
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_budget")
        .eq("id", user!.id)
        .single();

      if (profile) {
        setTotalBudget(Number(profile.total_budget) || 0);
      }

      // Fetch budget items
      const { data: budgetItems, error } = await supabase
        .from("budget_items")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(budgetItems || []);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTotalBudget = async (newBudget: number) => {
    setSavingBudget(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ total_budget: newBudget })
        .eq("id", user!.id);

      if (error) throw error;
      setTotalBudget(newBudget);
    } catch (error) {
      console.error("Error updating total budget:", error);
    } finally {
      setSavingBudget(false);
    }
  };

  const addItem = async () => {
    if (newCategory && newAmount && user) {
      try {
        const { data, error } = await supabase
          .from("budget_items")
          .insert({
            user_id: user.id,
            category: newCategory,
            amount: parseFloat(newAmount),
            paid: false,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setItems([data, ...items]);
          setNewCategory("");
          setNewAmount("");
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Error adding budget item:", error);
      }
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("budget_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting budget item:", error);
    }
  };

  const togglePaid = async (id: string, currentPaidStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("budget_items")
        .update({ paid: !currentPaidStatus })
        .eq("id", id);

      if (error) throw error;

      setItems(
        items.map((item) =>
          item.id === id ? { ...item, paid: !currentPaidStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating budget item:", error);
    }
  };

  const totalSpent = items.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budget Tracker</h2>
          <p className="text-muted-foreground">
            Manage your wedding expenses effortlessly
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Add a new category and amount to your budget
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., DJ, Decorations"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
              <Button onClick={addItem} className="w-full">
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Budget</CardDescription>
            <CardTitle className="text-3xl">${totalBudget.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <Input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                onBlur={(e) => updateTotalBudget(parseFloat(e.target.value) || 0)}
                className="mt-2"
                disabled={savingBudget}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-3xl text-primary">
              ${totalSpent.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {percentage.toFixed(1)}% of budget used
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Remaining</CardDescription>
            <CardTitle
              className={`text-3xl ${
                remaining < 0 ? "text-destructive" : "text-green-600"
              }`}
            >
              ${remaining.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {remaining < 0 ? "Over budget" : "Within budget"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
          <CardDescription>Visual representation of your spending</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={Math.min(percentage, 100)} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>${totalBudget.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>All your wedding expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator className="my-2" />}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={item.paid}
                      onChange={() => togglePaid(item.id, item.paid)}
                      className="h-4 w-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          item.paid ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      ${Number(item.amount).toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No expenses yet. Click &ldquo;Add Expense&rdquo; to get started!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
