"use client";

import { useState, useEffect } from "react";
import Stopwatch from "@/component/Stopwatch";
import Timer from "@/component/Timer";

// 1. UPDATE INTERFACE (Sesuai dengan TaskPage)
interface Task {
  task_id: string;   // Gunakan task_id, bukan id
  task_name: string; // Gunakan task_name
}

export default function Tracker() {
    const [isTimer, setIsTimer] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token"); 

            if (!token) {
                console.log("Token tidak ditemukan, user mungkin belum login.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/tasks", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const responseJson = await response.json();
                    
                    // 2. PERBAIKAN LOGIKA UNWRAP DATA (Sama seperti di TaskPage)
                    let taskList = [];
                    
                    // Cek apakah data ada di dalam properti .data
                    if (responseJson.data && Array.isArray(responseJson.data)) {
                        taskList = responseJson.data;
                    } 
                    // Fallback: Cek apakah respon langsung array
                    else if (Array.isArray(responseJson)) {
                        taskList = responseJson;
                    } 
                    else {
                        console.error("Format data tidak dikenali:", responseJson);
                        taskList = [];
                    }

                    setTasks(taskList);
                } else {
                    console.error("Gagal mengambil data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div className="flex flex-col h-screen w-full justify-center items-center gap-8 bg-base-100 px-4">
            
            {/* Toggle Button */}
            <div className="join bg-base-200 p-1 rounded-full">
                <button 
                    className={`btn btn-sm join-item rounded-full px-6 ${isTimer ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setIsTimer(true)}
                >
                    Timer
                </button>
                <button 
                    className={`btn btn-sm join-item rounded-full px-6 ${!isTimer ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setIsTimer(false)}
                >
                    Stopwatch
                </button>
            </div>

            {/* --- DROPDOWN TASK --- */}
            <div className="form-control w-full max-w-xs text-center">
                <label className="label justify-center pb-2">
                    <span className="label-text font-bold text-lg">Mau ngerjain apa?</span>
                </label>
                
                <select 
                    className="select select-bordered w-full text-center text-lg shadow-sm"
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                >
                    <option value="" disabled>-- Pilih Task --</option>
                    
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            // 3. GUNAKAN task_id SEBAGAI KEY DAN VALUE
                            <option key={task.task_id} value={task.task_id}>
                                {task.task_name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>Tidak ada task (Buat baru di menu Task)</option>
                    )}
                </select>
            </div>

            {/* Component Timer/Stopwatch */}
            <div className="flex justify-center w-full">
                {isTimer ? <Timer /> : <Stopwatch />}
            </div>

        </div>
    );
}