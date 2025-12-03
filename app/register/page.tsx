// app/register/page.tsx
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex flex-col justify-center h-screen items-center">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Register</legend>

                {/* Tambahkan class 'input-bordered' di sini */}
                <label className="label">Name</label>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    placeholder="Your Name" 
                />

                <label className="label">Email</label>
                <input 
                    type="email" 
                    className="input input-bordered w-full" 
                    placeholder="Email" 
                />

                <label className="label">Password</label>
                <input 
                    type="password" 
                    className="input input-bordered w-full" 
                    placeholder="Password" 
                />

                <label className="label">Confirm Password</label>
                <input 
                    type="password" 
                    className="input input-bordered w-full" 
                    placeholder="Re-type Password" 
                />

                <button className="btn btn-neutral mt-4 w-full">Sign Up</button>

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