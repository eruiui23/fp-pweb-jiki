"use client";

import { useState, useEffect } from "react";
import Stopwatch from "@/component/Stopwatch";
import Timer from "@/component/Timer";

interface Task {
  task_id: string;   
  task_name: string; 
}

export default function Tracker() {
    const [isTimer, setIsTimer] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token"); 
            if (!token) return;

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
                    let taskList = [];
                    if (responseJson.data && Array.isArray(responseJson.data)) {
                        taskList = responseJson.data;
                    } else if (Array.isArray(responseJson)) {
                        taskList = responseJson;
                    } 
                    setTasks(taskList);
                }
            } catch (error) {
                // Silent catch
            }
        };
        fetchTasks();
    }, []);

    // --- FUNGSI SIMPAN TRACKER ---
    const handleSaveTracker = async (durationInSeconds: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Sesi habis, silakan login ulang.");
            return;
        }
        
        const typeToSend = isTimer ? "timer" : "stopwatch";
        const idToSend = selectedTaskId || "";

        try {
            const response = await fetch("http://localhost:3000/api/trackers", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tracker_type: typeToSend,
                    duration: durationInSeconds,
                    task_id: idToSend, 
                    taskId: idToSend   
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                alert("Gagal menyimpan: " + (errData.message || JSON.stringify(errData)));
            } 
        } catch (error) {
            alert("Gagal terhubung ke server saat menyimpan tracker.");
        }
    };

    return (
        <div className="flex flex-col h-screen w-full justify-center items-center gap-8 bg-base-100 px-4">
            
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

            {/* --- AREA DROPDOWN DENGAN TOMBOL CLEAR --- */}
            <div className="form-control w-full max-w-xs text-center relative">
                <label className="label justify-center pb-2">
                    <span className="label-text font-bold text-lg"></span>
                </label>
                
                <div className="relative w-full">
                    <select 
                        className="select select-bordered w-full text-center text-lg shadow-sm bg-white text-black pr-10" // Tambah padding kanan (pr-10) biar teks gak nabrak tombol X
                        value={selectedTaskId}
                        onChange={(e) => setSelectedTaskId(e.target.value)}
                    >
                        {/* Opsi default untuk Unselect */}
                        <option className="text-center" value="">unassigned</option>
                        
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <option key={task.task_id} value={task.task_id}>
                                    {task.task_name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>Tidak ada task</option>
                        )}
                    </select>

                    {/* TOMBOL CLEAR (X) - Hanya muncul jika ada task yang dipilih */}
                    {selectedTaskId && (
                        <button
                            onClick={() => setSelectedTaskId("")} // Reset ke string kosong
                            className="btn btn-circle btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 hover:bg-gray-100"
                            title="Hapus pilihan task"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-center w-full">
                {isTimer ? (
                    <Timer onFinish={handleSaveTracker} />
                ) : (
                    <Stopwatch onFinish={handleSaveTracker} />
                )}
            </div>

        </div>
    );
}