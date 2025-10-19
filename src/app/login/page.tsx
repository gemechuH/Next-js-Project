"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link"
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Login successful");
      
      console.log("User:", data.user);
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
          required
        />
        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline mb-4 inline-block">Forgot Password?</Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
         <span className="text-black">Already have an account?<Link href="/signup" className="text-blue-600 hover:underline"> Sign up</Link></span>
      </form>
    </div>
  );
}
