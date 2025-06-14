"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Trash2,
  Filter,
  SortAsc,
  CheckCircle2,
  Circle,
  Calendar,
  Star,
  AlertCircle,
} from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: "low" | "medium" | "high";
}

type SortOption = "newest" | "oldest" | "priority" | "alphabetical";
type FilterOption = "all" | "active" | "completed";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [error, setError] = useState("");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("glassmorphic-todo-tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("glassmorphic-todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Validate task input
  // 3 <= task length <= 100
  const validateTask = (text: string): string => {
    if (!text.trim()) {
      return "Task cannot be empty";
    }
    if (text.trim().length < 3) {
      return "Task must be at least 3 characters long";
    }
    if (text.trim().length > 100) {
      return "Task must be less than 100 characters";
    }
    if (
      tasks.some(
        (task) => task.text.toLowerCase() === text.trim().toLowerCase()
      )
    ) {
      return "Task already exists";
    }
    return "";
  };

  // Add new task after validation
  const addTask = () => {
    const validationError = validateTask(newTask);
    if (validationError) {
      setError(validationError);
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date(),
      priority,
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask("");
    setError("");
    setPriority("medium");
  };

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Remove task
  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Clear all completed tasks
  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  // Filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filter
    switch (filterBy) {
      case "active":
        filtered = tasks.filter((task) => !task.completed);
        break;
      case "completed":
        filtered = tasks.filter((task) => task.completed);
        break;
      default:
        filtered = tasks;
    }

    // Apply sort
    switch (sortBy) {
      case "oldest":
        return filtered.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return filtered.sort(
          (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
        );
      case "alphabetical":
        return filtered.sort((a, b) => a.text.localeCompare(b.text));
      default: // newest
        return filtered.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
    }
  }, [tasks, filterBy, sortBy]);
//to find priority color for selected priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };
//to find priority icon for selected priority
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-3 h-3" />;
      case "medium":
        return <Star className="w-3 h-3" />;
      case "low":
        return <Circle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ITZ Todo
          </h1>
          <p className="text-white/70">Organize your tasks with style</p>
        </div>

        {/* Add Task Form */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-6 mb-6 shadow-xl">
          <div className="space-y-4">
            <div className="flex gap-3">
              {/* New Task Input */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => {
                    setNewTask(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask();
                    }
                  }}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                />
                {error && (
                  <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
                {/* Priority Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(priority)}
                      <span className="capitalize">{priority}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/80 backdrop-blur-md border-white/20">
                  <DropdownMenuRadioGroup
                    value={priority}
                    onValueChange={(value) => setPriority(value as any)}
                  >
                    <DropdownMenuRadioItem
                      value="high"
                      className="text-red-300"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      High Priority
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="medium"
                      className="text-yellow-300"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Medium Priority
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="low"
                      className="text-green-300"
                    >
                      <Circle className="w-4 h-4 mr-2" />
                      Low Priority
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats and Controls */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-4 mb-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>{completedCount} completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-blue-400" />
                <span>{activeCount} active</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {filterBy === "all"
                      ? "All"
                      : filterBy === "active"
                      ? "Active"
                      : "Completed"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/80 text-white backdrop-blur-md border-white/20">
                  <DropdownMenuRadioGroup
                    value={filterBy}
                    onValueChange={(value) =>
                      setFilterBy(value as FilterOption)
                    }
                  >
                    <DropdownMenuRadioItem value="all">
                      All Tasks
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="active">
                      Active Tasks
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="completed">
                      Completed Tasks
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <SortAsc className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/80 text-white backdrop-blur-md border-white/20">
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <DropdownMenuRadioItem value="newest">
                      Newest First
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">
                      Oldest First
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priority">
                      By Priority
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="alphabetical">
                      Alphabetical
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {completedCount > 0 && (
                <Button
                  onClick={clearCompleted}
                  variant="outline"
                  size="sm"
                  className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                >
                  Clear Completed
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8 text-center shadow-xl">
              <div className="text-white/60 text-lg">
                {filterBy === "all"
                  ? "No tasks yet. Add one above!"
                  : filterBy === "active"
                  ? "No active tasks!"
                  : "No completed tasks!"}
              </div>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className={`backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-4 shadow-xl transition-all duration-300 hover:bg-white/15 ${
                  task.completed ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-white/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />

                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={task.id}
                      className={`block text-white cursor-pointer transition-all duration-200 ${
                        task.completed
                          ? "line-through text-white/50"
                          : "hover:text-white/80"
                      }`}
                    >
                      {task.text}
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(task.priority)}
                          {task.priority}
                        </div>
                      </Badge>
                      <div className="flex items-center gap-1 text-white/40 text-xs">
                        <Calendar className="w-3 h-3" />
                        {task.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeTask(task.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-700 hover:bg-white "
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/50 text-sm">
          <p>Tasks are automatically saved to your browser's local storage</p>
        </div>
      </div>
    </div>
  );
}
