"use client"

import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "../api/ApiCollection"

interface UserProfile {
  id: string
  email: string
  fullName: string
  user_type: string
  phone?: string
  address?: string
}

const Profile = () => {
  const modalDelete = React.useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const userObj = JSON.parse(userData)
        setUser(userObj)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const { data: userFullData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => fetchUserProfile(user?.id || ""),
    enabled: !!user?.id,
  })

  useEffect(() => {
    if (userFullData) {
      setUser(userFullData)
      setLoading(false)
    }
  }, [userFullData])

  if (loading || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="loading loading-spinner loading-lg text-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-red-500 font-medium">Không tìm thấy thông tin người dùng</div>
      </div>
    )
  }

  const nameParts = user.fullName ? user.fullName.split(" ") : ["", ""]
  const firstName = nameParts[0] || "Admin"
  const lastName = nameParts.slice(1).join(" ") || "User"

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Gradient border top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 flex items-center justify-between">
            <h2 className="font-bold text-2xl xl:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h2>
            <button
              onClick={() => navigate("/profile/edit")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
            >
              <HiOutlinePencil className="text-lg" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-lg">
                  <img
                    src="https://avatars.githubusercontent.com/u/74099030?v=4"
                    alt="admin-avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-2xl text-gray-800">{user.fullName}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-indigo-700 capitalize w-fit">
                  {user.user_type}
                </span>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h4 className="font-semibold text-lg text-gray-800 whitespace-nowrap">Basic Information</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-purple-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Info Items */}
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">First Name</span>
                    <p className="text-gray-800 font-medium mt-1">{firstName}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Last Name</span>
                    <p className="text-gray-800 font-medium mt-1">{lastName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Email</span>
                    <p className="text-gray-800 font-medium mt-1">{user.email}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Phone</span>
                    <p className="text-gray-800 font-medium mt-1">{user.phone || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Address</span>
                    <p className="text-gray-800 font-medium mt-1">{user.address || "Chưa cập nhật"}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Password</span>
                    <button
                      onClick={() => navigate("/profile/edit")}
                      className="text-indigo-600 font-medium mt-1 hover:text-purple-600 transition-colors"
                    >
                      Change Password →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-400"></div>
          <div className="p-6">
            <button
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors"
              onClick={() => modalDelete.current?.showModal()}
            >
              <HiOutlineTrash className="text-lg" />
              Delete My Account
            </button>
          </div>
        </div>

        {/* Modal */}
        <dialog id="modal_delete" className="modal" ref={modalDelete}>
          <div className="modal-box bg-white rounded-2xl shadow-2xl">
            <h3 className="font-bold text-xl text-gray-800">Action Confirmation!</h3>
            <p className="py-4 text-gray-600">Do you want to delete your account?</p>
            <div className="modal-action flex-col gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem("authToken")
                  localStorage.removeItem("user")
                  window.dispatchEvent(new CustomEvent("authChange"))
                  navigate("/login")
                  toast.success("Tài khoản đã được xóa")
                }}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Yes, I want to delete my account
              </button>
              <form method="dialog" className="w-full">
                <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  No, I don't think so
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}

export default Profile
