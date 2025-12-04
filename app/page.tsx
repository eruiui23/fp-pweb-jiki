"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import Router untuk redirect logout
import Heatmap from "@/component/Heatmap"; 
import { UserCircle, LogOut, LogIn } from "lucide-react"; // Import Icon tambahan
import { 
  parseISO, 
  startOfDay, 
  differenceInCalendarDays, 
} from "date-fns";

interface TrackerData {
  createdAt: string;
  duration: number;
}

export default function Home() {
  const router = useRouter();
  const [trackers, setTrackers] = useState<TrackerData[]>([]);
  const [username, setUsername] = useState("User");
  
  // State untuk status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- FETCH DATA & CEK LOGIN ---
  useEffect(() => {
    const initData = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      // 1. Cek Login Status
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      // 2. Set Username
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          setUsername(userObj.usn || "User"); 
        } catch (e) { /* ignore */ }
      }

      if (!token) return;

      // 3. Fetch Data (Hanya kalau ada token)
      try {
        const res = await fetch("http://localhost:3000/api/trackers", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const json = await res.json();
          const dataList = json.data || (Array.isArray(json) ? json : []);
          setTrackers(dataList);
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    initData();
  }, []);

  // --- FUNGSI LOGOUT ---
  const handleLogout = () => {
    // Hapus data dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Update state
    setIsLoggedIn(false);
    setUsername("Guest");
    setTrackers([]); // Kosongkan data tracker
    
    // Redirect ke login (opsional, atau diam di home)
    router.push("/login");
  };

  // --- HITUNG STATISTIK ---
  const stats = useMemo(() => {
    if (trackers.length === 0) {
      return { totalHours: "0.0", dailyAvg: "0.0", currentStreak: 0, longestStreak: 0 };
    }

    const totalSeconds = trackers.reduce((acc, curr) => acc + curr.duration, 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);

    const uniqueDates = Array.from(new Set(
      trackers.map(t => startOfDay(parseISO(t.createdAt)).toISOString())
    ))
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

    const activeDays = uniqueDates.length;
    const dailyAvg = activeDays > 0 ? (totalSeconds / 3600 / activeDays).toFixed(1) : "0.0";

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = startOfDay(new Date());

    if (uniqueDates.length > 0) {
        const lastActive = uniqueDates[0];
        const diffToday = differenceInCalendarDays(today, lastActive);
        
        if (diffToday <= 1) { 
            currentStreak = 1;
            for (let i = 0; i < uniqueDates.length - 1; i++) {
                const diff = differenceInCalendarDays(uniqueDates[i], uniqueDates[i+1]);
                if (diff === 1) currentStreak++;
                else break;
            }
        }
    }

    if (uniqueDates.length > 0) {
        tempStreak = 1;
        longestStreak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const diff = differenceInCalendarDays(uniqueDates[i], uniqueDates[i+1]);
            if (diff === 1) tempStreak++;
            else tempStreak = 1;
            if (tempStreak > longestStreak) longestStreak = tempStreak;
        }
    }

    return { totalHours, dailyAvg, currentStreak, longestStreak };
  }, [trackers]);


  return (
    // 'relative' penting agar posisi absolute anak mengacu ke container ini
    <div className="flex flex-col justify-center h-screen items-center relative bg-base-100">
      
      {/* --- ICON PROFILE / AUTH (POJOK KANAN ATAS) --- */}
      <div className="absolute top-6 right-6 z-50">
        {isLoggedIn ? (
          // KONDISI 1: SUDAH LOGIN (Tampilkan Dropdown Logout)
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle hover:bg-base-200">
               {/* Hapus class avatar/placeholder biar icon pas ditengah */}
               <UserCircle size={32} />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-200">
              <li className="menu-title text-gray-400 text-xs uppercase px-4 py-2">
                Signed in as <span className="text-black font-bold normal-case">{username}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="text-red-500 hover:bg-red-50">
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          // KONDISI 2: BELUM LOGIN (Link ke Login)
          <Link href="/login">
            <button className="btn btn-ghost btn-circle hover:bg-base-200" title="Login">
               <LogIn size={30} />
            </button>
          </Link>
        )}
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex flex-col gap-4 w-full max-w-4xl px-4">
        
        <h1 className="text-center text-7xl mb-10 font-bold text-base-content">
          Hi, <span className="capitalize">{username}</span>
        </h1>

        <div className="flex flex-col gap-4 mx-auto w-full max-w-3xl">
          <p className="text-center text-xl text-base-content">
            been productive for <span className="font-bold">{stats.totalHours}</span> hours
          </p>
          
          <div className="flex justify-center">
             <Heatmap trackers={trackers} />
          </div>
          
          <div className="flex justify-around text-lg mt-2 text-base-content">
            <div className="text-center">
                <p className="text-gray-500 text-sm">daily avg</p>
                <p className="font-bold text-xl">{stats.dailyAvg}h</p>
            </div>
            <div className="text-center">
                <p className="text-gray-500 text-sm">longest streak</p>
                <p className="font-bold text-xl">{stats.longestStreak}d</p>
            </div>
          </div>
          
          <div className="text-center mt-2 text-base-content">
             <p className="text-gray-500 text-sm">current streak</p>
             <p className="font-bold text-xl">{stats.currentStreak} days</p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link href={isLoggedIn ? "/tracker" : "/login"}>
            <button className="btn btn-wide btn-neutral text-lg">
                {isLoggedIn ? "Track" : "Login to Track"}
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}