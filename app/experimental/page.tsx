"use client"
import { useState } from "react";
export default function Test () {
    const [count, setCount] = useState("aya"); 

  return (
    <div>
      <p>Anda mengklik {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik Saya
      </button>
    </div>
  );
}