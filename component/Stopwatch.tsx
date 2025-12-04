"use client";

import { useEffect, useState } from "react";

// 1. Tambahkan Interface Props
interface StopwatchProps {
  onFinish?: (duration: number) => void; // Fungsi untuk lapor ke Tracker
}

// 2. Terima props di sini
export default function Stopwatch({ onFinish }: StopwatchProps) {
    
    // stopwatch state
    const [totalSec, setTotalSec] = useState(0)
    const [isActive, setIsActive] = useState(false)

    const reset = () => {
        setTotalSec(0)
        setIsActive(false)
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive) {
            interval = setInterval(() => {
                setTotalSec(sec => sec + 1)
            }, 1000);
        } else if (!isActive && totalSec !== 0 && interval) {
            clearInterval(interval)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isActive, totalSec]) // Tambahkan totalSec di dependency biar aman

    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    // button state
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [buttonText, setButtonText] = useState("Start")

    const handleButton = () => {
        // start
        if (!isRunning || isPaused) {
            setButtonText("Pause")
            setIsRunning(true)
            setIsPaused(false)
            setIsActive(true)
        }
        // pause
        else if (!isPaused) {
            setButtonText("Continue")
            setIsPaused(true)
            setIsActive(false)
        }
    }

    // --- 3. MODIFIKASI HANDLE END ---
    const handleEnd = () => {
        // Simpan durasi saat ini sebelum di-reset
        const finalDuration = totalSec;

        // Panggil fungsi onFinish (Kirim data ke Parent)
        if (onFinish) {
            onFinish(finalDuration);
        }
        
        alert(`Stopwatch Selesai! Durasi: ${formatTime(finalDuration)} tersimpan.`);

        // Reset UI
        setIsRunning(false)
        setIsPaused(false)
        setButtonText("Start")
        reset() 
    }

    // Helper kecil buat alert biar cantik (opsional)
    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h}j ${m}m ${s}d`;
    }

    return (
        <div className="flex flex-col justify-between items-center gap-8 relative">
            
            <div
                className={`
                    transition-all duration-300 rounded-xl p-4
                    ${!isRunning ? "cursor-pointer hover:bg-base-200 hover:scale-105" : "cursor-default"}
                `}
                title={!isRunning ? "Stopwatch siap" : "Stopwatch sedang berjalan"}
            >

                <span className="countdown font-mono text-8xl select-none">
                    {hours > 0 && (
                        <>
                            <span style={{ "--value": hours } as React.CSSProperties}></span>:
                        </>
                    )
                    }
                    <span style={{ "--value": minutes, "--digits": 2 } as React.CSSProperties}></span>:
                    <span style={{ "--value": seconds, "--digits": 2 } as React.CSSProperties}></span>
                </span>
            </div>

            <div className="text-center flex flex-col gap-4 w-full items-center">
                <button 
                    className={`btn w-40 btn-lg ${isActive ? "btn-warning" : "btn-primary"}`} 
                    onClick={() => handleButton()}
                >
                    {buttonText}
                </button>

                {isRunning ? (
                    <button className="btn btn-ghost text-error" onClick={handleEnd}>
                        End
                    </button>
                ) : (
                    <div className="btn btn-ghost invisible">Placeholder</div>
                )}
            </div>
        </div>
    );
};