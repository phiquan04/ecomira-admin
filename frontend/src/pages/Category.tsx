"use client"

import React from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { fetchSingleCategory } from "../api/ApiCollection"
import IconRenderer from "../components/IconRenderer"

const Category = () => {
  const { id } = useParams()

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchSingleCategory(id || ""),
  })

  React.useEffect(() => {
    if (isLoading) {
      toast.loading("Loading...", { id: "promiseRead" })
    }
    if (isError) {
      toast.error("Error while getting the data!", {
        id: "promiseRead",
      })
    }
    if (isSuccess) {
      toast.success("Read the data successfully!", {
        id: "promiseRead",
      })
    }
  }, [isError, isLoading, isSuccess])

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full grid xl:grid-cols-3 gap-6 mt-5 xl:mt-0">
        {/* Main Content */}
        <div className="xl:col-span-2 flex flex-col items-start gap-6">
          {/* Hero Card with Icon */}
          <div className="w-full bg-gradient-to-br from-base-100 to-base-50 dark:from-base-200 dark:to-base-300 rounded-2xl p-8 shadow-lg border border-base-200 dark:border-base-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Icon Section */}
              {isLoading ? (
                <div className="w-24 xl:w-32 h-24 xl:h-32 rounded-2xl skeleton dark:bg-neutral flex-shrink-0"></div>
              ) : isSuccess ? (
                <div
                  className="p-6 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{
                    backgroundColor: data.color + "20",
                    color: data.color,
                  }}
                >
                  <IconRenderer iconName={data.icon} size={80} className="text-6xl xl:text-7xl" />
                </div>
              ) : null}

              {/* Title Section */}
              <div className="flex flex-col items-start gap-3">
                {isLoading ? (
                  <div className="w-56 h-10 skeleton dark:bg-neutral rounded-lg"></div>
                ) : isSuccess ? (
                  <h1 className="font-bold text-3xl xl:text-4xl dark:text-white text-base-content">{data.name}</h1>
                ) : null}
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Category Details
                </span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="w-full bg-base-100 dark:bg-base-200 rounded-2xl p-8 shadow-md border border-base-200 dark:border-base-300">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 skeleton dark:bg-neutral rounded-lg"></div>
                ))}
              </div>
            ) : isSuccess ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Name
                    </label>
                    <p className="text-lg font-semibold text-base-content dark:text-white mt-2">{data.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Icon
                    </label>
                    <div className="flex items-center gap-3 mt-2">
                      <IconRenderer iconName={data.icon} size={24} color={data.color} />
                      <span className="text-sm font-mono font-medium text-base-content dark:text-white">
                        {data.icon}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Status
                    </label>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold gap-2 ${
                          data.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${data.isActive ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                        {data.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Color
                    </label>
                    <div className="flex items-center gap-3 mt-2">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-base-300 shadow-sm"
                        style={{ backgroundColor: data.color }}
                      ></div>
                      <span className="text-sm font-mono font-medium text-base-content dark:text-white">
                        {data.color}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Created At
                    </label>
                    <p className="text-lg font-semibold text-base-content dark:text-white mt-2">
                      {new Date(data.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Description Card */}
          {isSuccess && (
            <div className="w-full bg-base-100 dark:bg-base-200 rounded-2xl p-8 shadow-md border border-base-200 dark:border-base-300">
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Description
              </label>
              <p className="text-base text-base-content dark:text-white mt-3 leading-relaxed">
                {data.description || "No description available"}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Statistics */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Total Products
              </span>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-4xl font-bold text-blue-700 dark:text-blue-200">0</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">No products yet</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Active Products
              </span>
              <span className="text-2xl">✨</span>
            </div>
            <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-200">0</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Waiting for products</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                Category ID
              </span>
              <span className="text-2xl">🏷️</span>
            </div>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-200 font-mono">{id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category
