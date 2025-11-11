"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getChecklistCategories } from "@/lib/services/categoryService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { Database } from "@/lib/types/database.types";

type ChecklistItem = Database["public"]["Tables"]["checklist_items"]["Row"];

export function WeddingChecklist() {
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([]);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchCategories();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getChecklistCategories();
      setCategories(data.map(cat => ({ id: cat.name, label: cat.label })));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleTask = async (id: string, currentCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from("checklist_items")
        .update({ completed: !currentCompleted })
        .eq("id", id);

      if (error) throw error;

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !currentCompleted } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() && newCategory && user) {
      try {
        const { data, error } = await supabase
          .from("checklist_items")
          .insert({
            user_id: user.id,
            task: newTask,
            completed: false,
            category: newCategory,
            priority: "medium",
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setTasks([data, ...tasks]);
          setNewTask("");
          setNewCategory("");
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from("checklist_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getTasksByCategory = (category: string) => {
    if (category === "all") return tasks;
    return tasks.filter((task) => task.category === category);
  };

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
          <h2 className="text-3xl font-bold tracking-tight">Wedding Checklist</h2>
          <p className="text-muted-foreground">
            Track every step of your wedding journey
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Add a task to your wedding checklist
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="task">Task</Label>
                <Input
                  id="task"
                  placeholder="e.g., Book DJ"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter(cat => cat.id !== "all")
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                </select>
              </div>
              <Button onClick={addTask} className="w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>
                {completedTasks} of {totalTasks} tasks completed
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{progress.toFixed(0)}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle>{category.label}</CardTitle>
                <CardDescription>
                  {getTasksByCategory(category.id).filter((t) => t.completed).length} /{" "}
                  {getTasksByCategory(category.id).length} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTasksByCategory(category.id).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id, task.completed)}
                        />
                        <span
                          className={`${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "font-medium"
                          }`}
                        >
                          {task.task}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {getTasksByCategory(category.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No tasks in this category yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
