"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();

    // --- STATE INPUT ---
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // --- STATE UI ---
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        setError("");
        setSuccess("");

        // 1. Validasi Client-Side Sederhana
        if (!username || !email || !password) {
            setError("Semua kolom wajib diisi!");
            return;
        }

        if (password !== confirmPassword) {
            setError("Password dan konfirmasi tidak cocok!");
            return;
        }

        setIsLoading(true);

        try {
            // 2. TEMBAK API REGISTER
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Body disesuaikan dengan docs: usn, email, pass
                body: JSON.stringify({
                    usn: username,
                    email: email,
                    pass: password,
                }),
            });

            // 3. HANDLE RESPONSE
            if (res.ok) {
                setSuccess("Registrasi berhasil! Mengalihkan ke login...");
                // Tunggu 1.5 detik biar user baca pesan sukses, lalu pindah halaman
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                // Coba ambil pesan error dari server jika ada
                const data = await res.json();
                setError(data.message || "Registrasi gagal. Coba username/email lain.");
            }

        } catch (err) {
            console.error("Register Error:", err);
            setError("Terjadi kesalahan koneksi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center min-h-screen items-center bg-base-100 py-10">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-6 shadow-lg">
                <legend className="fieldset-legend text-lg font-bold px-2">Register</legend>

                {/* USERNAME (usn) */}
                <label className="label">
                    <span className="label-text">Username</span>
                </label>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    placeholder="Username unik" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                {/* EMAIL (email) */}
                <label className="label mt-2">
                    <span className="label-text">Email</span>
                </label>
                <input 
                    type="email" 
                    className="input input-bordered w-full" 
                    placeholder="email@contoh.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* PASSWORD (pass) */}
                <label className="label mt-2">
                    <span className="label-text">Password</span>
                </label>
                <input 
                    type="password" 
                    className="input input-bordered w-full" 
                    placeholder="Password rahasia" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* CONFIRM PASSWORD (Validasi Lokal) */}
                <label className="label mt-2">
                    <span className="label-text">Confirm Password</span>
                </label>
                <input 
                    type="password" 
                    className={`input input-bordered w-full ${confirmPassword && password !== confirmPassword ? "input-error" : ""}`}
                    placeholder="Ketik ulang password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                
                {/* --- FEEDBACK MESSAGE --- */}
                {error && (
                    <div className="mt-4 p-2 text-xs text-red-600 bg-red-100 border border-red-200 rounded text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mt-4 p-2 text-xs text-green-600 bg-green-100 border border-green-200 rounded text-center">
                        {success}
                    </div>
                )}

                <button 
                    className="btn btn-neutral mt-6 w-full"
                    onClick={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? "Mendaftarkan..." : "Sign Up"}
                </button>

                <div className="text-center mt-4 text-sm text-gray-600">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="link link-hover text-blue-600 font-semibold">
                        Login
                    </Link>
                </div>
            </fieldset>
        </div>
    );
}