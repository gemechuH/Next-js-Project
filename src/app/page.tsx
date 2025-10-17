"use client"
import axios from "axios";
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";
export default function Home() {
  const router= useRouter()
  const handleLogout = async()=>{
    try {
      await axios.post ("/api/logout")
      toast.success("logged out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("logout failed, try again later")
      
    }
  }
  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
