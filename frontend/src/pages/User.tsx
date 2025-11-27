"use client"

import React from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { 
  fetchAUser, 
  fetchSellerStatsByUserId, 
  fetchCustomerStatsByUserId 
} from "../api/ApiCollection"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts"

const User = () => {
  const { id } = useParams()

  // Query để lấy thông tin user
  const { isLoading: userLoading, isError: userError, data: userData, isSuccess: userSuccess } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchAUser(id || ""),
  })

  // Query để lấy thống kê seller (chỉ chạy nếu user là seller)
  const { 
    data: sellerStats, 
    isLoading: sellerLoading, 
    isSuccess: sellerSuccess 
  } = useQuery({
    queryKey: ["sellerStats", id],
    queryFn: () => fetchSellerStatsByUserId(id || ""),
    enabled: !!userData && userData.userType === 'seller',
  })

  // Query để lấy thống kê customer (chỉ chạy nếu user là customer)
  const { 
    data: customerStats, 
    isLoading: customerLoading, 
    isSuccess: customerSuccess 
  } = useQuery({
    queryKey: ["customerStats", id],
    queryFn: () => fetchCustomerStatsByUserId(id || ""),
    enabled: !!userData && userData.userType === 'customer',
  })

  // Dữ liệu biểu đồ doanh thu (mẫu - bạn có thể thay bằng dữ liệu thật)
  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 2000 },
    { month: "Apr", revenue: 2780 },
    { month: "May", revenue: 1890 },
    { month: "Jun", revenue: 2390 },
  ]

  const activityData = [
    { name: "Jan", purchased: 4000, wishlisted: 2400 },
    { name: "Feb", purchased: 3000, wishlisted: 1398 },
    { name: "Mar", purchased: 2000, wishlisted: 9800 },
    { name: "Apr", purchased: 2780, wishlisted: 3908 },
    { name: "May", purchased: 1890, wishlisted: 4800 },
    { name: "Jun", purchased: 2390, wishlisted: 3800 },
  ]

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
      <div className="max-w-7xl mx-auto grid gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
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
                      <img src={userData.img || "/placeholder.svg"} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                      userData.verified ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-1">
                  {userLoading ? (
                    <div className="w-48 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg animate-pulse"></div>
                  ) : userSuccess ? (
                    <>
                      <h3 className="font-bold text-2xl text-gray-800">
                        {userData.firstName} {userData.lastName}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        userData.userType === 'seller' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {userData.userType === 'seller' ? '👑 Seller' : '👤 Customer'}
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
                <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-gray-800 font-medium mt-1">{userData.phone || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">User Type</span>
                    <p className="text-gray-800 font-medium mt-1 capitalize">{userData.userType}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl">
                    <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Status</span>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          userData.verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {userData.verified ? "✓ Verified" : "✗ Not Verified"}
                      </span>
                    </p>
                  </div>
                  
                  {/* Statistics Section */}
                  {userData.userType === 'seller' && sellerSuccess && (
                    <div className="col-span-2 mt-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Seller Statistics</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Total Revenue</span>
                          <p className="text-gray-800 font-medium mt-1">${sellerStats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                          <span className="text-xs font-semibold text-cyan-500 uppercase tracking-wide">Orders Sold</span>
                          <p className="text-gray-800 font-medium mt-1">{sellerStats.totalOrders}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                          <span className="text-xs font-semibold text-violet-500 uppercase tracking-wide">Products Listed</span>
                          <p className="text-gray-800 font-medium mt-1">{sellerStats.totalProducts}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {userData.userType === 'customer' && customerSuccess && (
                    <div className="col-span-2 mt-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Total Orders</span>
                          <p className="text-gray-800 font-medium mt-1">{customerStats.totalOrders}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                          <span className="text-xs font-semibold text-cyan-500 uppercase tracking-wide">Total Spent</span>
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
              <h4 className="font-semibold text-lg text-gray-800 mb-4">
                {userData?.userType === 'seller' ? 'Revenue Chart' : 'Activity Chart'}
              </h4>
              {userLoading ? (
                <div className="w-full h-[300px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl animate-pulse"></div>
              ) : userSuccess ? (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {userData.userType === 'seller' ? (
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                      </BarChart>
                    ) : (
                      <LineChart data={activityData}>
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="purchased"
                          stroke="#6366F1"
                          strokeWidth={3}
                          dot={{ fill: "#6366F1" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="wishlisted"
                          stroke="#A855F7"
                          strokeWidth={3}
                          dot={{ fill: "#A855F7" }}
                        />
                      </LineChart>
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