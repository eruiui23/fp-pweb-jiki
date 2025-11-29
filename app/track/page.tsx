"use client"

export default function tracker() {
    return (
        // <div className="flex flex-col justify-center items-center h-screen bg-gray-900">

        //     <div className="bg-red-600 text-white text-5xl font-bold p-8 rounded-xl shadow-2xl">
        //         00:00:00
        //     </div>
        //     <h1>ini text</h1>

        // </div>

        <div className="flex flex-col h-screen  justify-center items-center gap-4">
            <div className="flex gap-4 ">
                <button className="btn">Timer</button>
                <button className="btn">Stopwatch</button>
            </div>
            <p>nama task</p>
            <div className=" bg-blue-400 text-7xl p-5">25:12</div>
            <button>ini button buat play puse dll</button>
        </div>
    )
}