import Image from "next/image";
import * as React from "react";
import Link from "next/link";
import Heatmap from "@/component/Heatmap"

export default function Home() {
  return (
    // <div className="flex flex-col gap-4">
    //   <h1 className="text-center text-7xl mt-44 mb-10">Hi, User</h1>

    //   <div className="flex flex-col w-136 gap-4 mx-auto">
    //     <p className="text-center">been productive for .. hour</p>
    //     <div className="h-48  bg-blue-200">heatmap</div>
    //     <div className="flex justify-around ">
    //       <p>daily avg</p>
    //       <p>longest streak</p>
    //     </div>
    //     <p className="text-center">current streak</p>
    //   </div>

    //   <div className="flex justify-center">
    //     <button className="btn mx-auto ">Track</button>

    //   </div>


    // </div>

    <div className="flex flex-col justify-center h-screen items-center ">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-7xl mb-10">Hi, User</h1>

        <div className="flex flex-col w-136 gap-4 mx-auto ">
          <p className="text-center">been productive for .. hour</p>
          <Heatmap/>
          <div className="flex justify-around ">
            <p>daily avg</p>
            <p>longest streak</p>
          </div>
          <p className="text-center">current streak</p>
        </div>

        <div className="flex justify-center">
          <Link href={"/tracker"}>
            <button className="btn mx-auto">Track</button>
          </Link>

        </div>


      </div>

    </div>
  );
}
