"use client"; 

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function GlobalSpeedDial() {
  const pathname = usePathname();
  const disabledRoutes = ["/login", "/register"];

  if (disabledRoutes.includes(pathname)) {
    return null;
  }

  return (
    <div className="fab">
      <div tabIndex={0} role="button" className="btn btn-lg btn-circle btn-success">J</div>

      <Link href={"/"}>
        <div>Home <button className="btn btn-lg btn-circle">H</button></div>
      </Link>
      <Link href={"/tracker"}>
        <div>Tracker <button className="btn btn-lg btn-circle">T</button></div>
      </Link>
      {/* <Link href={"/statistic"}>
        <div>Detail <button className="btn btn-lg btn-circle">A</button></div>
      </Link> */}

      <Link href={"/tasks"}>
        <div>Task List <button className="btn btn-lg btn-circle">L</button></div>
      </Link>
    </div>
  )
}