"use client";

import { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "completed";

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // Load tasks from localStorage on first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    }
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">📝 To-Do List</h1>

      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Enter a task..."
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 justify-center mb-3">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as Filter)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filteredTasks.length === 0 ? (
          <li className="text-gray-500 text-center">No tasks found.</li>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <span
                className={`flex-1 cursor-pointer ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
                onClick={() => toggleTask(task.id)}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 text-sm"
              >
                ❌
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
