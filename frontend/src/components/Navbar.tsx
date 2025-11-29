"use client"

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { HiBars3CenterLeft } from "react-icons/hi2"
import { HiSearch, HiOutlineBell } from "react-icons/hi"
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx"
import toast from "react-hot-toast"
import { menu } from "./menu/data"
import MenuItem from "./menu/MenuItem"

const Navbar = () => {
  const [isFullScreen, setIsFullScreen] = React.useState(true)
  const [user, setUser] = React.useState<any>(null)
  const element = document.getElementById("root")

  const [isDrawerOpen, setDrawerOpen] = React.useState(false)
  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen)

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev)
  }

  const navigate = useNavigate()

  React.useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  React.useEffect(() => {
    if (isFullScreen) {
      document.exitFullscreen()
    } else {
      element?.requestFullscreen({ navigationUI: "auto" })
    }
  }, [element, isFullScreen])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    window.dispatchEvent(new CustomEvent("authChange"))
    navigate("/login")
  }

  return (
    <div className="fixed z-[3] top-0 left-0 right-0 bg-white/80 backdrop-blur-md w-full flex justify-between px-4 xl:px-6 py-3 xl:py-4 gap-4 xl:gap-0 border-b border-indigo-100 shadow-sm">
      {/* container */}
      <div className="flex gap-3 items-center">
        {/* for mobile */}
        <div className="drawer w-auto p-0 mr-1 xl:hidden">
          <input
            id="drawer-navbar-mobile"
            type="checkbox"
            className="drawer-toggle"
            checked={isDrawerOpen}
            onChange={toggleDrawer}
          />
          <div className="p-0 w-auto drawer-content">
            <label htmlFor="drawer-navbar-mobile" className="p-0 btn btn-ghost drawer-button text-indigo-600">
              <HiBars3CenterLeft className="text-2xl" />
            </label>
          </div>
          <div className="drawer-side z-[99]">
            <label htmlFor="drawer-navbar-mobile" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="menu p-4 w-auto min-h-full bg-gradient-to-b from-white to-indigo-50 text-gray-800">
              <Link to={"/"} className="flex items-center gap-2 mt-1 mb-5">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ecomira
                </span>
              </Link>
              {menu.map((item, index) => (
                <MenuItem onClick={toggleDrawer} key={index} catalog={item.catalog} listItems={item.listItems} />
              ))}
            </div>
          </div>
        </div>

        {/* navbar logo */}
        <Link to={"/"} className="flex items-center gap-2">
          <span className="text-lg xl:text-xl 2xl:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ecomira
          </span>
        </Link>
      </div>

      {/* navbar items to right */}
      <div className="flex items-center gap-1 xl:gap-2">
        {/* search */}
        <button
          onClick={() => toast("Gaboleh cari!", { icon: "😠" })}
          className="hidden sm:inline-flex btn btn-circle btn-ghost text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          <HiSearch className="text-xl 2xl:text-2xl" />
        </button>

        {/* fullscreen */}
        <button
          onClick={toggleFullScreen}
          className="hidden xl:inline-flex btn btn-circle btn-ghost text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          {isFullScreen ? (
            <RxEnterFullScreen className="xl:text-xl 2xl:text-2xl" />
          ) : (
            <RxExitFullScreen className="xl:text-xl 2xl:text-2xl" />
          )}
        </button>

        {/* notification */}
        <button
          onClick={() => toast("Gaada notif!", { icon: "😠" })}
          className="btn btn-circle btn-ghost text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          <HiOutlineBell className="text-xl 2xl:text-2xl" />
        </button>

        {/* avatar dropdown */}
        <div className="dropdown dropdown-end ml-1">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar ring-2 ring-indigo-200 hover:ring-indigo-400 transition-all"
          >
            <div className="w-9 rounded-full">
              <img src="https://avatars.githubusercontent.com/u/74099030?v=4" alt="admin-avatar" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-white rounded-2xl w-56 border border-indigo-100"
          >
            <li className="px-3 py-2">
              <span className="font-semibold text-gray-800">{user?.fullName || "Admin User"}</span>
            </li>
            <li className="px-3 pb-2">
              <span className="text-xs text-gray-500">{user?.email || "admin@example.com"}</span>
            </li>
            <div className="h-px bg-gradient-to-r from-blue-100 to-purple-100 my-2"></div>
            <Link to={"/profile"}>
              <li>
                <a className="rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors">
                  My Profile
                </a>
              </li>
            </Link>
            <li onClick={handleLogout}>
              <a className="rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors">Log Out</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
