"use client";

import { useEffect, useState } from "react";

export default function Stopwatch() {
    //stopwatch
    const [totalSec, setTotalSec] = useState(0)
    const [isActive, setIsActive] = useState(false)

    const toggle = () => (setIsActive(!isActive))

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


    }, [isActive])


    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    // button

    let initialText = "Start"
    // let isRunning = false
    // let isPaused = false
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

        // running
        else if (!isPaused) {
            setButtonText("Continue")
            setIsPaused(true)
            setIsActive(false)
        }
    }

    const handleEnd = () => {
        setIsRunning(false)
        setIsPaused(false)
        setButtonText("Start")
        reset()
        // call post buat naro statistik handle end

    }


    return (
        <div className="flex flex-col justify-between items-center gap-8 relative">
            {/* For TSX uncomment the commented types below */}
            <div
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
                    )
                    }
                    <span style={{ "--value": minutes, "--digits": 2 } as React.CSSProperties}></span>:
                    <span style={{ "--value": seconds, "--digits": 2 } as React.CSSProperties}></span>
                </span>
            </div>

            <div className="text-center flex flex-col gap-4 w-full items-center">
                <button className="btn w-40 btn-lg" onClick={() => handleButton()}>{buttonText}</button>

                {isRunning ? (
                    <button className="btn btn-ghost text-error" onClick={handleEnd}>
                        End
                    </button>
                ) : (
                    <div className="btn btn-ghost invisible"></div>
                )}
            </div>
        </div>
    );
};
