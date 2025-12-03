"use client";

import { useEffect, useState } from "react";

export default function Timer() {
    const [userMinutes, setUserMinutes] = useState(25);
    const [totalSec, setTotalSec] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    // state button
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [buttonText, setButtonText] = useState("Start");

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && totalSec > 0) {
            interval = setInterval(() => {
                setTotalSec((sec) => {
                    if (sec <= 1) {
                        clearInterval(interval!);
                        setIsActive(false);
                        setIsRunning(false);
                        setButtonText("Selesai");
                        return 0;
                    }
                    return sec - 1;
                });
            }, 1000);
        } else if (!isActive && interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, totalSec]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value; // Ambil string mentahnya dulu

        // 1. Cek: Kalau kosong (user hapus semua), set ke 0
        if (rawValue === "") {
            setUserMinutes(0);
            return;
        }

        // 2. Kalau ada isinya, baru di-parse ke angka
        const val = parseInt(rawValue);

        // 3. Validasi angka (harus angka valid dan tidak minus)
        if (!isNaN(val) && val >= 0) {
            setUserMinutes(val);
        }
    };

    //  modal
    const openSettings = () => {
        // 
        if (!isRunning) {
            const modal = document.getElementById('settings_modal') as HTMLDialogElement;
            if (modal) modal.showModal();
        }
    }

    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const handleButton = () => {
        if (!isRunning || isPaused) {
            if (totalSec === 0 && userMinutes > 0) {
                setTotalSec(userMinutes * 60);
            } else if (totalSec === 0) return;

            setButtonText("Pause");
            setIsRunning(true);
            setIsPaused(false);
            setIsActive(true);
        }
        else if (!isPaused) {
            setButtonText("Continue");
            setIsPaused(true);
            setIsActive(false);
        }
    };

    const handleEnd = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsActive(false);
        setButtonText("Start");
        setTotalSec(userMinutes * 60);
    };

    const saveAndClose = () => {
        setTotalSec(userMinutes * 60);
    }

    return (
        <div className="flex flex-col justify-between items-center gap-8 relative">

            {/* countdown  */}
            <div
                onClick={openSettings}
                className={`
                    transition-all duration-300 rounded-xl p-4
                    ${!isRunning ? "cursor-pointer hover:bg-base-200 hover:scale-105" : "cursor-default"}
                `}
                title={!isRunning ? "Klik angka untuk ubah waktu" : "Timer sedang berjalan"}
            >
                <span className="countdown font-mono text-8xl select-none">
                    {hours > 0 && (
                        <>
                            <span style={{ "--value": hours } as React.CSSProperties}></span>:
                        </>
                    )}
                    <span style={{ "--value": minutes, "--digits": 2 } as React.CSSProperties}></span>:
                    <span style={{ "--value": seconds, "--digits": 2 } as React.CSSProperties}></span>
                </span>
            </div>

            {/* 2. TOMBOL KONTROL */}
            <div className="text-center flex flex-col gap-4 w-full items-center">
                <button
                    className={`btn w-40 btn-lg ${isActive ? "btn-warning" : "btn-primary"}`}
                    onClick={handleButton}
                >
                    {buttonText}
                </button>

                {isRunning ? (
                    <button className="btn btn-ghost text-error" onClick={handleEnd}>
                        End / Reset
                    </button>
                ) : (
                    <div className="btn btn-ghost invisible"></div>
                )}
            </div>

            <dialog id="settings_modal" className="modal">
                {/* Fix Background: 
                   - 'bg-white': Memaksa background putih solid 
                   - 'text-black': Memastikan teks berwarna hitam agar kontras
                */}
                <div className="modal-box bg-white text-black">
                    <h3 className="font-bold text-lg mb-4">Timer Setting</h3>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-black">Focus Duration</span>
                        </label>
                        <input
                            type="number"
                            value={userMinutes === 0 ? "" : userMinutes}
                            onChange={handleInputChange}
                            placeholder="minute  "
                            className="input input-bordered w-full text-lg bg-gray-100 text-black border-gray-300"
                        />
                        <label className="label mt-2">
                            <span className="label-text-alt text-gray-500">Timer will be set to the number above</span>
                        </label>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            {/* Tombol Simpan */}
                            <button className="btn btn-primary" onClick={saveAndClose}>Save & Close</button>
                        </form>
                    </div>
                </div>

                {/* Backdrop */}
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        </div>
    );
}