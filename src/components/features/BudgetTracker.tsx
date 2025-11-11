"use client";

import { useState, useEffect } from "react";
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
import { Plus, Trash2, DollarSign, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  paid: boolean;
}

export function BudgetTracker() {
  const [totalBudget, setTotalBudget] = useState<number>(50000);
  const [items, setItems] = useState<BudgetItem[]>([
    { id: "1", category: "Venue", amount: 15000, paid: false },
    { id: "2", category: "Catering", amount: 12000, paid: false },
    { id: "3", category: "Photography", amount: 5000, paid: false },
    { id: "4", category: "Flowers", amount: 3000, paid: false },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalSpent = items.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentage = (totalSpent / totalBudget) * 100;

  const addItem = () => {
    if (newCategory && newAmount) {
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        category: newCategory,
        amount: parseFloat(newAmount),
        paid: false,
      };
      setItems([...items, newItem]);
      setNewCategory("");
      setNewAmount("");
      setIsDialogOpen(false);
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const togglePaid = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, paid: !item.paid } : item
      )
    );
  };

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
                className="mt-2"
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
                      onChange={() => togglePaid(item.id)}
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
                      ${item.amount.toLocaleString()}
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
