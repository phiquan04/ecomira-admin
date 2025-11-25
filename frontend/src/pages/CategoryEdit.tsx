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
    <div className="w-full p-0 m-0">
      <div className="w-full mb-6">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-base-content dark:hover:text-white transition-colors mb-4 font-medium"
        >
          <BiArrowBack className="text-xl" />
          Back to Categories
        </button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl xl:text-4xl font-bold text-base-content dark:text-white">
            {isLoading ? "Loading..." : "Edit Category"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isLoading ? "Fetching category details..." : `Editing: ${categoryData?.name || ""}`}
          </p>
        </div>
      </div>

      <div className="w-full bg-base-100 dark:bg-base-200 rounded-2xl shadow-lg border border-base-200 dark:border-base-300 overflow-hidden">
        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin">
                  <div className="w-12 h-12 border-4 border-base-300 dark:border-base-400 border-t-primary rounded-full"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">Loading category details...</p>
              </div>
            </div>
          ) : (
            <AddData slug="category" isOpen={true} setIsOpen={handleClose} editData={categoryData} />
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryEdit
