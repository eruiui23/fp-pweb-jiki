"use client"

import { useState, useEffect, CSSProperties } from "react"
// import ProductivityTimer from "@/component/ProductivityTimer"; 
import Stopwatch from "@/component/Stopwatch";
import Timer from "@/component/Timer"



export default function Tracker() {

    const[isTimer, setIsTimer] = useState(true)

    // const setTimer = () => {
    //     setIsTimer(true)
    // }

    // const setStopwatch = () => {
    //     setIsTimer(false)
    // }

    return (
        <div className="flex flex-col h-screen  justify-center items-center gap-4">
            <div className="flex gap-4 ">
                <button className="btn" onClick={() => setIsTimer(true)}>Timer</button>
                <button className="btn" onClick={() => setIsTimer(false)}>Stopwatch</button>
            </div>
            <p>nama task</p>
            {
                isTimer?(
                    <Timer/>
                ):(
                    <Stopwatch/>
                )
            }
            {/* <div className=" bg-blue-400 text-7xl p-5">25:12</div>
            <StrStpButton /> */}
        </div>
    )
}