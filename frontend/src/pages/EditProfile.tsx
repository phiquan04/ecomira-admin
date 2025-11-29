"use client"

import React, { type ChangeEvent, useState, useEffect } from "react"
import toast from "react-hot-toast"
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { updateUserProfile, changePassword, fetchUserProfile } from "../api/ApiCollection"

interface UserProfile {
  id: string
  email: string
  fullName: string
  user_type: string
  phone?: string
  address?: string
}

const EditProfile = () => {
  const modalDelete = React.useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nickName, setNickName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswordForm, setShowPasswordForm] = useState(false)

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
      const nameParts = userFullData.fullName ? userFullData.fullName.split(" ") : ["", ""]
      setFirstName(nameParts[0] || "")
      setLastName(nameParts.slice(1).join(" ") || "")
      setNickName(nameParts[0] || "")
      setEmail(userFullData.email || "")
      setPhone(userFullData.phone || "")
      setAddress(userFullData.address || "")
      setLoading(false)
    }
  }, [userFullData])

  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: any) => updateUserProfile(user?.id || "", updatedData),
    onSuccess: (data) => {
      const updatedUser = { ...user, ...data, user_type: user?.user_type }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      toast.success("Thông tin đã được cập nhật")
      navigate("/profile")
    },
    onError: (error: any) => {
      toast.error("Cập nhật thất bại: " + (error.response?.data?.message || error.message))
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: any) => changePassword(user?.id || "", passwordData),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordForm(false)
    },
    onError: (error: any) => {
      toast.error("Đổi mật khẩu thất bại: " + (error.response?.data?.message || error.message))
    },
  })

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUpload = e.target.files[0]
      setSelectedFile(imageUpload)
      setPreview(URL.createObjectURL(imageUpload))
    }
  }

  const handleIconClick = () => {
    fileInputRef.current?.click()
  }

  const handleSave = () => {
    if (!user) return
    const updatedData = {
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      user_type: user.user_type,
    }
    updateProfileMutation.mutate(updatedData)
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }
    changePasswordMutation.mutate({ currentPassword, newPassword })
  }

  if (loading || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
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

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-bold text-2xl xl:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Profile
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="px-5 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Avatar Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-lg">
                  <img
                    src={preview || "https://avatars.githubusercontent.com/u/74099030?v=4"}
                    alt="admin-avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleIconClick}
                  className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                >
                  <HiOutlinePencil className="text-white text-lg" />
                </button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*" />
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-2xl text-gray-800">
                  {firstName} {lastName}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-indigo-700 capitalize w-fit">
                  {user.user_type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <h4 className="font-semibold text-lg text-gray-800 whitespace-nowrap">Basic Information</h4>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-purple-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                    placeholder="First Name"
                  />
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <label className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-white border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                    placeholder="Email"
                  />
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <label className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-white border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                    placeholder="Phone"
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <label className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Password</label>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        {showPasswordForm && (
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="font-semibold text-lg text-gray-800 whitespace-nowrap">Change Password</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-purple-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                    placeholder="Current Password"
                  />
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <label className="text-xs font-semibold text-purple-500 uppercase tracking-wide">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-white border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                    placeholder="New Password"
                  />
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <label className="text-xs font-semibold text-pink-500 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-white border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={changePasswordMutation.isPending}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? "Changing..." : "Update Password"}
              </button>
            </div>
          </div>
        )}

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

export default EditProfile
