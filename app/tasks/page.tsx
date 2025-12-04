"use client";

import React, { useState, useEffect } from "react";
import { Trash2, CheckCircle, Circle, Calendar } from "lucide-react"; 

// 1. UPDATE INTERFACE SESUAI LOG CONSOLE
interface Task {
  task_id: string;    // <--- INI PERBAIKAN UTAMANYA
  task_name: string;
  due_date: string | null; // Bisa string atau null
  completed: boolean;
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  // --- GET DATA ---
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const responseJson = await res.json();
        
        let taskList = [];
        if (responseJson.data && Array.isArray(responseJson.data)) {
            taskList = responseJson.data;
        } else if (Array.isArray(responseJson)) {
            taskList = responseJson;
        } else {
            taskList = [];
        }

        setTasks(taskList); 
      }
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  // --- POST DATA (Add Task) ---
  const handleAddTask = async () => {
    setError("");
    
    if (!taskName) {
      setError("Nama task wajib diisi!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda harus login dulu!");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        task_name: taskName,
        due_date: dueDate ? dueDate : null, 
        completed: false
      };

      const res = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchTasks();
        setTaskName("");
        setDueDate("");
      } else {
        const errData = await res.json();
        setError(errData.message || "Gagal membuat task");
      }
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };


  // --- DELETE DATA (Pakai task_id) ---
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if(!token) return;

    if(!confirm("Yakin mau hapus task ini?")) return;

    try {
      // Perhatikan URL endpoint DELETE, pastikan sesuai
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        // Filter menggunakan task_id
        setTasks(tasks.filter((t) => t.task_id !== id));
      } else {
        alert("Gagal menghapus task");
      }
    } catch (err) {
      console.error(err);
    }
  };


  // --- PUT DATA (Update Status) ---
  const handleToggleComplete = async (task: Task) => {
    const token = localStorage.getItem("token");
    if(!token) return;

    const newStatus = !task.completed;

    // Optimistic Update menggunakan task_id
    setTasks(tasks.map((t) => t.task_id === task.task_id ? { ...t, completed: newStatus } : t));

    try {
      // Gunakan task.task_id di URL
      await fetch(`http://localhost:3000/api/tasks/${task.task_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          task_name: task.task_name, 
          due_date: task.due_date,
          completed: newStatus       
        })
      });
    } catch (err) {
      console.error("Gagal update status:", err);
      fetchTasks();
    }
  };


  return (
    <div className="min-h-screen bg-base-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Manager</h1>

      {/* --- FORM ADD TASK --- */}
      <div className="card w-full max-w-lg bg-base-200 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-sm opacity-70">Add New Task (Database)</h2>
          
          <div className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Task Name *</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Coding API"
                className={`input input-bordered w-full ${error ? "input-error" : ""}`}
                value={taskName}
                onChange={(e) => {
                    setTaskName(e.target.value);
                    if(error) setError("");
                }}
              />
              {error && <span className="text-red-500 text-xs mt-2 ml-1">* {error}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Due Date <span className="text-gray-400 text-xs">(Optional)</span></span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <button 
                className="btn btn-primary mt-2" 
                onClick={handleAddTask}
                disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Add Task"}
            </button>
          </div>
        </div>
      </div>

      {/* --- LIST TASK --- */}
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">My Tasks ({tasks.length})</h2>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 italic">
             {isLoading ? "Loading data..." : "Belum ada task di database."}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div 
                // PERBAIKAN KEY DI SINI: Gunakan task.task_id
                key={task.task_id} 
                className={`flex items-center justify-between p-4 rounded-lg border shadow-sm transition-all ${
                  task.completed ? "bg-green-50 border-green-200" : "bg-white border-base-300"
                }`}
              >
                
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggleComplete(task)} className="btn btn-ghost btn-circle btn-sm">
                    {task.completed ? <CheckCircle className="text-green-600" size={24} /> : <Circle className="text-gray-400" size={24} />}
                  </button>

                  <div className="flex flex-col">
                    <p className={`font-bold ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {task.task_name} 
                    </p>
                    
                    <div className="flex items-center gap-1 mt-1">
                        {/* Tanggal dari database mungkin formatnya "1970-01-01T00:00...", kita cek apakah valid */}
                        {task.due_date && task.due_date.startsWith("1970") === false ? (
                            <>
                                <Calendar size={12} className="text-gray-500" />
                                {/* Ambil cuma 10 karakter pertama (YYYY-MM-DD) biar rapi */}
                                <span className="text-xs text-gray-500">{String(task.due_date).substring(0, 10)}</span>
                            </>
                        ) : (
                            <span className="text-xs text-gray-400 italic">No deadline</span>
                        )}
                    </div>

                  </div>
                </div>

                <button 
                  // Gunakan task.task_id saat menghapus
                  onClick={() => handleDelete(task.task_id)} 
                  className="btn btn-square btn-outline btn-error btn-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}