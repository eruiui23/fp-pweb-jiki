"use client"; // <--- WAJIB: Karena kita butuh akses URL browser

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
      {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
      <div tabIndex={0} role="button" className="btn btn-lg btn-circle btn-success">J</div>

      {/* buttons that show up when FAB is open */}
      <Link href={"/"}>
        <div>Home <button className="btn btn-lg btn-circle">H</button></div>
      </Link>
      <Link href={"/tracker"}>
        <div>Tracker <button className="btn btn-lg btn-circle">T</button></div>
      </Link>
      <Link href={"/statistic"}>
        <div>Detail <button className="btn btn-lg btn-circle">A</button></div>
      </Link>

      <Link href={"/tasks"}>
        <div>List <button className="btn btn-lg btn-circle">L</button></div>
      </Link>
    </div>
  )
}