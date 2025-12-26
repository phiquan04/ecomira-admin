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
  fetchCustomerOrdersByUserId,
  fetchSellerOrderItemsByUserId,
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
import { DataGrid, type GridColDef } from "@mui/x-data-grid"

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

  // Seller stats query
  const {
    data: sellerStats,
    isLoading: sellerStatsLoading,
    isSuccess: sellerStatsSuccess,
  } = useQuery({
    queryKey: ["sellerStats", id],
    queryFn: () => fetchSellerStatsByUserId(id || ""),
    enabled: !!userData && userData.userType === "seller",
  })

  // Customer stats query
  const {
    data: customerStats,
    isLoading: customerStatsLoading,
    isSuccess: customerStatsSuccess,
  } = useQuery({
    queryKey: ["customerStats", id],
    queryFn: () => fetchCustomerStatsByUserId(id || ""),
    enabled: !!userData && userData.userType === "customer",
  })

  // Seller revenue chart query
  const {
    data: revenueChartData,
    isLoading: revenueChartLoading,
    isSuccess: revenueChartSuccess,
  } = useQuery({
    queryKey: ["sellerRevenueChart", id],
    queryFn: () => fetchSellerRevenueChart(id || ""),
    enabled: !!userData && userData.userType === "seller",
  })

  // Customer activity chart query
  const {
    data: activityChartData,
    isLoading: activityChartLoading,
    isSuccess: activityChartSuccess,
  } = useQuery({
    queryKey: ["customerActivityChart", id],
    queryFn: () => fetchCustomerActivityChart(id || ""),
    enabled: !!userData && userData.userType === "customer",
  })

  // Customer orders query
  const {
    data: customerOrders,
    isLoading: customerOrdersLoading,
    isSuccess: customerOrdersSuccess,
  } = useQuery({
    queryKey: ["customerOrders", id],
    queryFn: () => fetchCustomerOrdersByUserId(id || ""),
    enabled: !!userData && userData.userType === "customer",
  })

  // Seller order items query
  const {
    data: sellerOrderItems,
    isLoading: sellerOrderItemsLoading,
    isSuccess: sellerOrderItemsSuccess,
  } = useQuery({
    queryKey: ["sellerOrderItems", id],
    queryFn: () => fetchSellerOrderItemsByUserId(id || ""),
    enabled: !!userData && userData.userType === "seller",
  })

  // Customer orders columns
  const customerOrderColumns: GridColDef[] = [
    { field: "id", headerName: "Order ID", width: 80 },
    {
      field: "orderNumber",
      headerName: "Order Number",
      minWidth: 150,
      flex: 1.5,
      renderCell: (params) => <span className="font-mono text-sm">{params.value}</span>,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 120,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">${Number.parseFloat(params.value).toLocaleString()}</span>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = params.value.toLowerCase()
        let bgColor = "bg-gray-100"
        let textColor = "text-gray-700"

        switch (status) {
          case "delivered":
            bgColor = "bg-green-100"
            textColor = "text-green-700"
            break
          case "shipping":
            bgColor = "bg-blue-100"
            textColor = "text-blue-700"
            break
          case "confirmed":
            bgColor = "bg-yellow-100"
            textColor = "text-yellow-700"
            break
          case "cancelled":
            bgColor = "bg-red-100"
            textColor = "text-red-700"
            break
          case "pending":
            bgColor = "bg-orange-100"
            textColor = "text-orange-700"
            break
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{params.value}</span>
        )
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      width: 120,
      renderCell: (params) => {
        const status = params.value
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "COMPLETED"
                ? "bg-green-100 text-green-700"
                : status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : status === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {params.value}
          </span>
        )
      },
    },
    {
      field: "itemCount",
      headerName: "Items",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <span className="text-center">{params.value}</span>,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      width: 160,
      renderCell: (params) => {
        const date = new Date(params.value)
        return (
          <span className="text-sm text-gray-600">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )
      },
    },
  ]

  // Seller order items columns
  const sellerOrderItemColumns: GridColDef[] = [
    { field: "id", headerName: "Item ID", width: 70 },
    {
      field: "orderNumber",
      headerName: "Order Number",
      width: 150,
      renderCell: (params) => <span className="font-mono text-sm">{params.value}</span>,
    },
    {
      field: "productName",
      headerName: "Product",
      minWidth: 250,
      flex: 2,
      renderCell: (params) => (
        <div className="flex items-center gap-2 overflow-hidden">
          {params.row.image && (
            <div className="w-8 h-8 rounded shrink-0 overflow-hidden">
              <img
                src={params.row.image || "/placeholder.svg"}
                alt={params.value}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/Portrait_Placeholder.png"
                }}
              />
            </div>
          )}
          <span className="truncate">{params.value}</span>
        </div>
      ),
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 60,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <span className="text-center">{params.value}</span>,
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => <span>${Number.parseFloat(params.value).toLocaleString()}</span>,
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      width: 110,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">${Number.parseFloat(params.value).toLocaleString()}</span>
      ),
    },
    {
      field: "customerName",
      headerName: "Customer",
      width: 140,
      renderCell: (params) => <span className="truncate">{params.value}</span>,
    },
    {
      field: "orderStatus",
      headerName: "Status",
      width: 110,
      renderCell: (params) => {
        const status = params.value.toLowerCase()
        let bgColor = "bg-gray-100"
        let textColor = "text-gray-700"

        switch (status) {
          case "delivered":
            bgColor = "bg-green-100"
            textColor = "text-green-700"
            break
          case "shipping":
            bgColor = "bg-blue-100"
            textColor = "text-blue-700"
            break
          case "confirmed":
            bgColor = "bg-yellow-100"
            textColor = "text-yellow-700"
            break
          case "cancelled":
            bgColor = "bg-red-100"
            textColor = "text-red-700"
            break
          case "pending":
            bgColor = "bg-orange-100"
            textColor = "text-orange-700"
            break
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{params.value}</span>
        )
      },
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 110,
      renderCell: (params) => {
        const date = new Date(params.value)
        return <span className="text-sm text-gray-600">{date.toLocaleDateString()}</span>
      },
    },
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
                        src={userData.avatar || userData.img || "/Portrait_Placeholder.png"}
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
                          userData.userType === "seller"
                            ? "bg-orange-100 text-orange-700"
                            : userData.userType === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {userData.userType === "seller"
                          ? "👑 Seller"
                          : userData.userType === "admin"
                            ? "⚙️ Admin"
                            : "👤 Customer"}
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
                  {userData.userType === "seller" && sellerStatsSuccess && sellerStats && (
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
                  {userData.userType === "customer" && customerStatsSuccess && customerStats && (
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

          {/* Orders Section - Hiển thị theo user type */}
          {userData?.userType === "customer" && (
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Customer Orders
                  </h4>
                  <span className="text-sm text-gray-500">
                    {customerOrdersLoading
                      ? "Loading..."
                      : customerOrdersSuccess && customerOrders
                        ? `${customerOrders.length} orders`
                        : "No orders"}
                  </span>
                </div>

                {customerOrdersLoading ? (
                  <div className="w-full h-[200px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl animate-pulse flex items-center justify-center">
                    <span className="text-gray-500">Loading orders...</span>
                  </div>
                ) : customerOrdersSuccess && customerOrders && customerOrders.length > 0 ? (
                  <div className="w-full" style={{ height: 400 }}>
                    <DataGrid
                      rows={customerOrders}
                      columns={customerOrderColumns}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
                        },
                      }}
                      pageSizeOptions={[5, 10, 25]}
                      disableRowSelectionOnClick
                      sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: "#f8fafc",
                          borderRadius: "8px 8px 0 0",
                        },
                        "& .MuiDataGrid-cell": {
                          borderBottom: "1px solid #f1f5f9",
                        },
                        "& .MuiDataGrid-row:hover": {
                          backgroundColor: "#f1f5f9",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-lg">No orders found for this customer</p>
                    <p className="text-sm">This customer hasn't placed any orders yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {userData?.userType === "seller" && (
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Seller Order Items
                  </h4>
                  <span className="text-sm text-gray-500">
                    {sellerOrderItemsLoading
                      ? "Loading..."
                      : sellerOrderItemsSuccess && sellerOrderItems
                        ? `${sellerOrderItems.length} items sold`
                        : "No items sold"}
                  </span>
                </div>

                {sellerOrderItemsLoading ? (
                  <div className="w-full h-[200px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl animate-pulse flex items-center justify-center">
                    <span className="text-gray-500">Loading order items...</span>
                  </div>
                ) : sellerOrderItemsSuccess && sellerOrderItems && sellerOrderItems.length > 0 ? (
                  <div className="w-full" style={{ height: 400 }}>
                    <DataGrid
                      rows={sellerOrderItems}
                      columns={sellerOrderItemColumns}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
                        },
                      }}
                      pageSizeOptions={[5, 10, 25]}
                      disableRowSelectionOnClick
                      sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: "#f8fafc",
                          borderRadius: "8px 8px 0 0",
                        },
                        "& .MuiDataGrid-cell": {
                          borderBottom: "1px solid #f1f5f9",
                        },
                        "& .MuiDataGrid-row:hover": {
                          backgroundColor: "#f1f5f9",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🛒</div>
                    <p className="text-lg">No order items found for this seller</p>
                    <p className="text-sm">This seller hasn't sold any products yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Không hiển thị gì cho admin */}
          {userData?.userType === "admin" && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">⚙️</div>
              <p className="text-lg">Administrator Account</p>
              <p className="text-sm">Order information is not displayed for admin accounts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default User
