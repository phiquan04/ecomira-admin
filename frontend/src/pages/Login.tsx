"use client"

import type React from "react"
import { useState } from "react"
import ChangeThemes from "../components/ChangesThemes"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    // Clear any existing auth data trước khi login mới
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/login`,
      {
        email,
        password,
      },
    )

    const { user, token } = response.data

    if (user.user_type !== "admin") {
      toast.error(`Tài khoản ${user.user_type} không có quyền truy cập admin panel`)
      setLoading(false)
      return
    }

    // Lưu token và thông tin user
    localStorage.setItem("authToken", token)
    localStorage.setItem("user", JSON.stringify(user))

    toast.success("Đăng nhập thành công!")
    
    // Trigger auth change event
    window.dispatchEvent(new CustomEvent('authChange'));
    
    // Chuyển hướng sau 100ms để đảm bảo state được cập nhật
    setTimeout(() => {
      navigate("/", { replace: true })
    }, 100)
    
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Đăng nhập thất bại"
    toast.error(errorMsg)
  } finally {
    setLoading(false)
  }
}
  return (
    // screen
    <div className="w-full p-0 m-0">
      {/* container */}
      <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50 relative">
        {/* theme */}
        <div className="absolute top-5 right-5 z-[99]">
          <ChangeThemes />
        </div>

        {/* Changed form to use handleLogin */}
        <form
          onSubmit={handleLogin}
          className="w-full h-screen xl:h-auto xl:w-[30%] 2xl:w-[25%] 3xl:w-[20%] bg-white rounded-2xl shadow-lg flex flex-col items-center p-5 pb-7 gap-8 pt-20 xl:pt-7 border-t-4 border-transparent bg-clip-padding"
          style={{ borderImage: "linear-gradient(90deg, #5B7FFF, #A855F7) 1" }}
        >
          <div className="flex items-center justify-center w-full gap-2">
            <span className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ecomira Admin
            </span>
          </div>
          <div className="w-full flex flex-col items-stretch gap-3">
            <label className="input input-bordered min-w-full flex items-center gap-2 border-gray-200 focus-within:border-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70 text-gray-400"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
                placeholder="Email"
                value={email} // Added value binding
                onChange={(e) => setEmail(e.target.value)} // Added onChange
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 border-gray-200 focus-within:border-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70 text-gray-400"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
                placeholder="Password"
                value={password} // Added value binding
                onChange={(e) => setPassword(e.target.value)} // Added onChange
              />
            </label>
            <div className="flex items-center justify-between">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox w-4 h-4 rounded-md"
                    style={{ accentColor: "#5B7FFF" }}
                  />
                  <span className="label-text text-xs text-gray-600">Remember me</span>
                </label>
              </div>
              <a
                href="#"
                className="font-semibold text-xs no-underline hover:text-purple-600 transition-colors"
                style={{ color: "#5B7FFF" }}
              >
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="btn btn-block text-white font-semibold py-3 rounded-lg transition-all hover:shadow-lg active:scale-95"
              style={{ background: "linear-gradient(135deg, #5B7FFF 0%, #A855F7 100%)" }}
              disabled={loading} // Added disabled state
            >
              {loading ? "Logging in..." : "Log In"} {/* Added loading state */}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
