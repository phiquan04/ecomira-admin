"use client"

import React from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { fetchSingleProduct } from "../api/ApiCollection"

const Product = () => {
  const { id } = useParams()

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchSingleProduct(id || ""),
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
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-8">
            {/* Product Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              {isLoading ? (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse"></div>
              ) : isSuccess ? (
                <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-indigo-100 shadow-lg">
                  <img src={data.imageUrl || "/noimage.png"} alt="product" className="w-full h-full object-cover" />
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                {isLoading ? (
                  <div className="w-48 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg animate-pulse"></div>
                ) : isSuccess ? (
                  <>
                    <h1 className="font-bold text-2xl xl:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {data.name}
                    </h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-indigo-700 w-fit">
                      Product
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Product Details */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl animate-pulse"
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
                  <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Price</span>
                  <p className="text-gray-800 font-bold mt-1 text-lg">${data.price}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Stock Quantity</span>
                  <p className="text-gray-800 font-medium mt-1">{data.stockQuantity}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Category ID</span>
                  <p className="text-gray-800 font-medium mt-1">{data.categoryId}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Status</span>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        data.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {data.isActive ? "✓ Active" : "✗ Inactive"}
                    </span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Created At</span>
                  <p className="text-gray-800 font-medium mt-1">
                    {new Date(data.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="col-span-full p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Description</span>
                  <p className="text-gray-700 mt-2 leading-relaxed">{data.description || "No description available"}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
