"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const router = useRouter(); // ✅ inside component

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post("/api/signup", form);
    toast.success(res.data.message);

    setForm({ username: "", email: "", password: "" });

    // ✅ redirect to home after signup
    router.push("/");
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <span className="text-black">Already have an account?<Link href="/login" className="text-blue-600 hover:underline"> Log in</Link></span>
      </form>
      
    </div>
  );
}
