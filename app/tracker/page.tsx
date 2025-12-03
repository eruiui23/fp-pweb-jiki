"use client"

import { useState, useEffect, CSSProperties } from "react"
// import ProductivityTimer from "@/component/ProductivityTimer"; 
import Timer from "@/component/Timer";

function StrStpButton() {
    let initialText = "Start"
    // let isRunning = false
    // let isPaused = false
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [buttonText, setButtonText] = useState("Start")

    const handleButton = () => {
        if (!isRunning || isPaused) {
            setButtonText("Pause")
            setIsRunning(true)
            setIsPaused(false)
        }

        else if (!isPaused) {
            setButtonText("Continue")
            setIsPaused(true)
        }
    }

    const handleEnd = () => {
        setIsRunning(false)
        setIsPaused(false)
        alert("Timer selesai!")
        setButtonText(("Start")
        )
    }

    return (

        <div className=" text-center flex flex-col gap 4 justify-between h-25">
            <button className="btn" onClick={() => handleButton()}>{buttonText}</button>
            {
                isPaused && isRunning && (
                    <button className="btn" onClick={handleEnd}>End</button>
                )
            }
        </div>
    )
}

// function Timer() {
//     let counter = 10
//     return (
//         <div>
//         </div>
//     )


// }



function Stopwatch() {

}

export default function Tracker() {
    return (

        <div className="flex flex-col h-screen  justify-center items-center gap-4">
            <div className="flex gap-4 ">
                <button className="btn">Timer</button>
                <button className="btn">Stopwatch</button>
            </div>
            <p>nama task</p>
            
            <Timer/>
            {/* <div className=" bg-blue-400 text-7xl p-5">25:12</div>
            <StrStpButton /> */}
        </div>
    )
}