// app/login/page.tsx
import Link from "next/link"; 

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

                {/* --- TAMBAHAN LINK KE REGISTER DI SINI --- */}
                <div className="text-center mt-4 text-sm text-gray-600">
                    Belum punya akun?{" "}
                    <Link href="/register" className="link link-hover text-blue-600 font-semibold">
                        Daftar
                    </Link>
                </div>

            </fieldset>
        </div>
    );
}