"use client"

import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { fetchSingleCategory } from "../api/ApiCollection"
import IconRenderer from "../components/IconRenderer"
import { BiArrowBack } from "react-icons/bi"

const Category = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchSingleCategory(id || ""),
  })

  React.useEffect(() => {
    if (isLoading) {
      toast.loading("Loading...", { id: "promiseRead" })
    }
    if (isError) {
      toast.error("Error while getting the data!", { id: "promiseRead" })
    }
    if (isSuccess) {
      toast.success("Read the data successfully!", { id: "promiseRead" })
    }
  }, [isError, isLoading, isSuccess])

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6 font-medium group"
        >
          <BiArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
          Back to Categories
        </button>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Hero Card */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {isLoading ? (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse"></div>
                  ) : isSuccess ? (
                    <div
                      className="p-6 rounded-2xl shadow-lg"
                      style={{
                        backgroundColor: data.color + "15",
                        color: data.color,
                      }}
                    >
                      <IconRenderer iconName={data.icon} size={64} className="text-5xl" />
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    {isLoading ? (
                      <div className="w-48 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg animate-pulse"></div>
                    ) : isSuccess ? (
                      <>
                        <h1 className="font-bold text-2xl xl:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {data.name}
                        </h1>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-indigo-700 uppercase tracking-wide w-fit">
                          Category Details
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="p-8">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : isSuccess ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Name</span>
                      <p className="text-gray-800 font-medium mt-1">{data.name}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Icon</span>
                      <div className="flex items-center gap-3 mt-1">
                        <IconRenderer iconName={data.icon} size={20} color={data.color} />
                        <span className="text-sm font-mono text-gray-700">{data.icon}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                      <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Color</span>
                      <div className="flex items-center gap-3 mt-1">
                        <div
                          className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
                          style={{ backgroundColor: data.color }}
                        ></div>
                        <span className="text-sm font-mono text-gray-700">{data.color}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                      <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Status</span>
                      <p className="mt-1">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            data.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${data.isActive ? "bg-green-500" : "bg-red-500"}`}
                          ></span>
                          {data.isActive ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                    <div className="col-span-full p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                      <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Created At</span>
                      <p className="text-gray-800 font-medium mt-1">
                        {new Date(data.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Description Card */}
            {isSuccess && (
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <div className="p-8">
                  <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Description</span>
                  <p className="text-gray-700 mt-3 leading-relaxed">{data.description || "No description available"}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Statistics */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-b-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold uppercase tracking-wide opacity-90">Total Products</span>
                  <span className="text-2xl">📦</span>
                </div>
                <p className="text-4xl font-bold">0</p>
                <p className="text-sm opacity-80 mt-2">No products yet</p>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-b-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold uppercase tracking-wide opacity-90">Active Products</span>
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-4xl font-bold">0</p>
                <p className="text-sm opacity-80 mt-2">Waiting for products</p>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-b-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold uppercase tracking-wide opacity-90">Category ID</span>
                  <span className="text-2xl">🏷️</span>
                </div>
                <p className="text-2xl font-bold font-mono">{id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category
