"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchSingleCategory } from "../api/ApiCollection"
import AddData from "../components/AddData"
import { BiArrowBack } from "react-icons/bi"

const CategoryEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchSingleCategory(id || ""),
    enabled: !!id,
  })

  const handleClose = () => {
    navigate("/categories")
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
            Back to Categories
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isLoading ? "Loading..." : "Edit Category"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLoading ? "Fetching category details..." : `Editing: ${categoryData?.name || ""}`}
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
                  <p className="text-gray-500 mt-4 font-medium">Loading category details...</p>
                </div>
              </div>
            ) : (
              <AddData slug="category" isOpen={true} setIsOpen={handleClose} editData={categoryData} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryEdit
