"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true }); // important if cookie is HTTP-only
      localStorage.removeItem("token"); // clear from localStorage too
      toast.success("You have been logged out!");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
