"use client";

import { useState } from "react";
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
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
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

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  category: string;
  dueDate?: string;
}

const defaultTasks: ChecklistItem[] = [
  { id: "1", task: "Book ceremony venue", completed: false, category: "venue" },
  { id: "2", task: "Book reception venue", completed: false, category: "venue" },
  { id: "3", task: "Hire wedding planner", completed: false, category: "planning" },
  { id: "4", task: "Create guest list", completed: false, category: "guests" },
  { id: "5", task: "Send save-the-dates", completed: false, category: "guests" },
  { id: "6", task: "Book photographer", completed: false, category: "vendors" },
  { id: "7", task: "Book videographer", completed: false, category: "vendors" },
  { id: "8", task: "Book caterer", completed: false, category: "vendors" },
  { id: "9", task: "Choose wedding cake", completed: false, category: "food" },
  { id: "10", task: "Book florist", completed: false, category: "decor" },
];

export function WeddingChecklist() {
  const [tasks, setTasks] = useState<ChecklistItem[]>(defaultTasks);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("planning");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const categories = [
    { id: "all", label: "All Tasks" },
    { id: "venue", label: "Venue" },
    { id: "vendors", label: "Vendors" },
    { id: "guests", label: "Guests" },
    { id: "food", label: "Food & Drink" },
    { id: "decor", label: "Decor" },
    { id: "planning", label: "Planning" },
  ];

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task: ChecklistItem = {
        id: Date.now().toString(),
        task: newTask,
        completed: false,
        category: newCategory,
      };
      setTasks([...tasks, task]);
      setNewTask("");
      setIsDialogOpen(false);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getTasksByCategory = (category: string) => {
    if (category === "all") return tasks;
    return tasks.filter((task) => task.category === category);
  };

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
                  <option value="planning">Planning</option>
                  <option value="venue">Venue</option>
                  <option value="vendors">Vendors</option>
                  <option value="guests">Guests</option>
                  <option value="food">Food & Drink</option>
                  <option value="decor">Decor</option>
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
                          onCheckedChange={() => toggleTask(task.id)}
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
