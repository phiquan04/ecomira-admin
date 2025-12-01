"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchAUser } from "../api/ApiCollection"
import AddData from "../components/AddData"
import { BiArrowBack } from "react-icons/bi"

const UserEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchAUser(id || ""),
    enabled: !!id,
  })

  const handleClose = () => {
    navigate("/users")
  }

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-4 font-medium group"
          >
            <BiArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
            Back to Users
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isLoading ? "Loading..." : "Edit User"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLoading
                ? "Fetching user details..."
                : `Editing: ${userData?.firstName || ""} ${userData?.lastName || ""}`}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-block animate-spin">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-500 mt-4 font-medium">Loading user details...</p>
                </div>
              </div>
            ) : (
              <AddData slug="user" isOpen={true} setIsOpen={handleClose} editData={userData} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserEdit
