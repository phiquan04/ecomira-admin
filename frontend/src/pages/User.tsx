"use client"

import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import {
  fetchAUser,
  fetchSellerStatsByUserId,
  fetchCustomerStatsByUserId,
  fetchSellerRevenueChart,
  fetchCustomerActivityChart,
} from "../api/ApiCollection"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts"
import { BiArrowBack } from "react-icons/bi"

const User = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    isLoading: userLoading,
    isError: userError,
    data: userData,
    isSuccess: userSuccess,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchAUser(id || ""),
  })

  const { data: sellerStats, isSuccess: sellerSuccess } = useQuery({
    queryKey: ["sellerStats", id],
    queryFn: () => fetchSellerStatsByUserId(id || ""),
    enabled: !!userData && userData.userType === "seller",
  })

  const { data: customerStats, isSuccess: customerSuccess } = useQuery({
    queryKey: ["customerStats", id],
    queryFn: () => fetchCustomerStatsByUserId(id || ""),
    enabled: !!userData && userData.userType === "customer",
  })

  const { data: revenueChartData, isSuccess: revenueChartSuccess } = useQuery({
    queryKey: ["sellerRevenueChart", id],
    queryFn: () => fetchSellerRevenueChart(id || ""),
    enabled: !!userData && userData.userType === "seller",
  })

  const { data: activityChartData, isSuccess: activityChartSuccess } = useQuery({
    queryKey: ["customerActivityChart", id],
    queryFn: () => fetchCustomerActivityChart(id || ""),
    enabled: !!userData && userData.userType === "customer",
  })

  React.useEffect(() => {
    if (userLoading) {
      toast.loading("Loading...", { id: "promiseRead" })
    }
    if (userError) {
      toast.error("Error while getting the data!", { id: "promiseRead" })
    }
    if (userSuccess) {
      toast.success("Read the data successfully!", { id: "promiseRead" })
    }
  }, [userError, userLoading, userSuccess])

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6 font-medium group"
        >
          <BiArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
          Back to Users
        </button>

        <div className="grid gap-6">
          {/* Profile Card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <div className="p-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                {userLoading ? (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse"></div>
                ) : userSuccess ? (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-lg">
                      <img
                        src={userData.avatar || userData.img || "/placeholder.svg?height=96&width=96&query=avatar"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                        userData.verified ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-1">
                  {userLoading ? (
                    <div className="w-48 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg animate-pulse"></div>
                  ) : userSuccess ? (
                    <>
                      <h3 className="font-bold text-2xl xl:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {userData.firstName} {userData.lastName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${
                          userData.userType === "seller" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {userData.userType === "seller" ? "👑 Seller" : "👤 Customer"}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              {/* User Details */}
              {userLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : userSuccess ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">First Name</span>
                    <p className="text-gray-800 font-medium mt-1">{userData.firstName}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Last Name</span>
                    <p className="text-gray-800 font-medium mt-1">{userData.lastName}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Email</span>
                    <p className="text-gray-800 font-medium mt-1">{userData.email}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Phone</span>
                    <p className="text-gray-800 font-medium mt-1">{userData.phone || "N/A"}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">User Type</span>
                    <p className="text-gray-800 font-medium mt-1 capitalize">{userData.userType}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl">
                    <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Status</span>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          userData.verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${userData.verified ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                        {userData.verified ? "Verified" : "Not Verified"}
                      </span>
                    </p>
                  </div>

                  {/* Seller Statistics */}
                  {userData.userType === "seller" && sellerSuccess && (
                    <div className="col-span-full mt-4">
                      <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Seller Statistics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
                            Total Revenue
                          </span>
                          <p className="text-gray-800 font-medium mt-1">${sellerStats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                          <span className="text-xs font-semibold text-cyan-500 uppercase tracking-wide">
                            Orders Sold
                          </span>
                          <p className="text-gray-800 font-medium mt-1">{sellerStats.totalOrders}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                          <span className="text-xs font-semibold text-violet-500 uppercase tracking-wide">
                            Products Listed
                          </span>
                          <p className="text-gray-800 font-medium mt-1">{sellerStats.totalProducts}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Statistics */}
                  {userData.userType === "customer" && customerSuccess && (
                    <div className="col-span-full mt-4">
                      <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Customer Statistics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
                            Total Orders
                          </span>
                          <p className="text-gray-800 font-medium mt-1">{customerStats.totalOrders}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                          <span className="text-xs font-semibold text-cyan-500 uppercase tracking-wide">
                            Total Spent
                          </span>
                          <p className="text-gray-800 font-medium mt-1">${customerStats.totalSpent.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Chart Card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <div className="p-6">
              <h4 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {userData?.userType === "seller" ? "Revenue Chart (Last 6 Months)" : "Activity Chart (Last 6 Months)"}
              </h4>
              {userLoading ? (
                <div className="w-full h-[300px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl animate-pulse"></div>
              ) : userSuccess ? (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {userData.userType === "seller" ? (
                      revenueChartSuccess && revenueChartData ? (
                        <BarChart data={revenueChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis dataKey="month" stroke="#6366f1" />
                          <YAxis stroke="#6366f1" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "12px",
                              border: "1px solid #e0e7ff",
                            }}
                          />
                          <Legend />
                          <Bar dataKey="revenue" fill="#6366f1" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No revenue data available
                        </div>
                      )
                    ) : activityChartSuccess && activityChartData ? (
                      <LineChart data={activityChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis dataKey="month" stroke="#6366f1" />
                        <YAxis yAxisId="left" stroke="#6366f1" />
                        <YAxis yAxisId="right" orientation="right" stroke="#a855f7" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            border: "1px solid #e0e7ff",
                          }}
                        />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="orderCount"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ fill: "#6366f1" }}
                          name="Orders"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="totalSpent"
                          stroke="#a855f7"
                          strokeWidth={3}
                          dot={{ fill: "#a855f7" }}
                          name="Total Spent ($)"
                        />
                      </LineChart>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No activity data available
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
