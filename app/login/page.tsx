// app/login/page.tsx
import Link from "next/link"; // Component khusus Next.js buat pindah halaman

export default function LoginPage() {
    return (
        <div className="flex flex-col justify-center h-screen items-center ">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Login</legend>

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" />

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" />

                <button className="btn btn-neutral mt-4">Login</button>
            </fieldset>
        </div>
    );
}