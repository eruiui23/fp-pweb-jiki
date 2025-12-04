"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usn: username, pass: password }),
            });

            const responseJson = await res.json(); 

            if (res.ok) {
                if (responseJson.data && responseJson.data.token) {
                    
                    localStorage.setItem("token", responseJson.data.token);
                    
                    localStorage.setItem("user", JSON.stringify(responseJson.data.user));
                    
                    alert("Login Berhasil!");
                    router.push("/");
                } else {
                    console.error("Struktur respon tidak sesuai:", responseJson);
                    setError("Login berhasil, tapi token tidak ditemukan.");
                }
            } else {
                setError(responseJson.message || "Username atau password salah!");
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError("Gagal terhubung ke server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center h-screen items-center bg-base-100">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-6 shadow-lg">
                <legend className="fieldset-legend text-lg font-bold px-2">Login</legend>

                <label className="label"><span className="label-text">Username</span></label>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                />

                <label className="label mt-2"><span className="label-text">Password</span></label>
                <input 
                    type="password" 
                    className="input input-bordered w-full" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                />

                {error && (
                    <div className="mt-4 p-2 text-xs text-red-500 bg-red-100 rounded text-center border border-red-200">
                        {error}
                    </div>
                )}

                <button 
                    className="btn btn-neutral mt-6 w-full" 
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Login"}
                </button>
                
                <div className="text-center mt-4">
                     <p className="text-sm text-gray-600">Belum punya akun? <Link href="/register" className="link text-blue-600">Daftar</Link></p>
                </div>
            </fieldset>
        </div>
    );
}