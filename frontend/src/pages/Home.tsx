"use client"

import type React from "react"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { FaAward, FaCrown, FaMedal } from "react-icons/fa"
import { HiShoppingBag, HiUserGroup, HiUsers } from "react-icons/hi2"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { fetchRegistrationTrends, fetchTopCustomers, fetchTopSellers, fetchUserStats } from "../api/ApiCollection"

// Types
interface UserStats {
  totalUsers: number
  totalSellers: number
  totalCustomers: number
}

interface TrendData {
  label: string
  sellers: number
  customers: number
  total: number
}

interface TopUser {
  rank: number
  id: number
  fullName: string
  email: string
  phone: string | null
  verified: boolean
  totalRevenue?: number
  totalSpent?: number
  totalOrders: number
  deliveredOrders: number
  img: string
}

type PeriodType = "weekly" | "monthly" | "yearly"

// Format currency helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
}) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/60 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-2xl ${bgColor}`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  </div>
)

// Registration Chart Component
const RegistrationChart = ({
  data,
  period,
  onPeriodChange,
  isLoading,
}: {
  data: TrendData[]
  period: PeriodType
  onPeriodChange: (period: PeriodType) => void
  isLoading: boolean
}) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="card-title text-lg">Biến Động Đăng Ký Người Dùng</h2>
        <div className="tabs tabs-boxed">
          <button className={`tab ${period === "weekly" ? "tab-active" : ""}`} onClick={() => onPeriodChange("weekly")}>
            Tuần
          </button>
          <button
            className={`tab ${period === "monthly" ? "tab-active" : ""}`}
            onClick={() => onPeriodChange("monthly")}
          >
            Tháng
          </button>
          <button className={`tab ${period === "yearly" ? "tab-active" : ""}`} onClick={() => onPeriodChange("yearly")}>
            Năm
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-base-content/60">Chưa có dữ liệu</div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSellers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--b1))",
                  border: "1px solid hsl(var(--b3))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="sellers"
                name="Người bán"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSellers)"
              />
              <Area
                type="monotone"
                dataKey="customers"
                name="Khách hàng"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCustomers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </div>
)

// Rank Badge Component
const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <FaCrown className="w-5 h-5 text-yellow-500" title="Top 1" />
  if (rank === 2) return <FaMedal className="w-5 h-5 text-gray-400" title="Top 2" />
  if (rank === 3) return <FaAward className="w-5 h-5 text-amber-600" title="Top 3" />
  return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-base-content/60">{rank}</span>
}

// Top Users Table Component
// Cập nhật bảng TopUsersTable trong Home.tsx
const TopUsersTable = ({
  title,
  users,
  type,
  isLoading,
}: {
  title: string
  users: TopUser[]
  type: "seller" | "customer"
  isLoading: boolean
}) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title text-lg mb-4">{title}</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-base-content/60">Chưa có dữ liệu</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="w-16">Hạng</th>
                <th>Người dùng</th>
                <th className="text-right">{type === "seller" ? "Doanh thu" : "Chi tiêu"}</th>
                <th className="text-right">Tổng đơn</th>
                <th className="text-right">Đã giao</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover">
                  <td>
                    <RankBadge rank={user.rank} />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10">
                          <img 
                            src={user.img || "/Portrait_Placeholder.png"} 
                            alt={user.fullName}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/Portrait_Placeholder.png';
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {user.fullName}
                          {user.verified && (
                            <span className="badge badge-success badge-xs" title="Đã xác minh">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="text-sm opacity-50 truncate max-w-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-semibold">
                    {type === "seller" ? 
                      formatCurrency(user.totalRevenue || 0) : 
                      formatCurrency(user.totalSpent || 0)}
                  </td>
                  <td className="text-right">
                    <span className={`badge ${user.totalOrders > 0 ? 'badge-info' : 'badge-ghost'}`}>
                      {user.totalOrders} đơn
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`badge ${user.deliveredOrders > 0 ? 'badge-success' : 'badge-ghost'}`}>
                      {user.deliveredOrders} đơn
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)

// Main Home Component
const Home = () => {
  const [period, setPeriod] = useState<PeriodType>("weekly")

  // Fetch user stats
  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  })

  // Fetch registration trends
  const { data: trendData, isLoading: trendLoading } = useQuery<TrendData[]>({
    queryKey: ["registrationTrends", period],
    queryFn: () => fetchRegistrationTrends(period),
  })

  // Fetch top sellers
  const { data: topSellers, isLoading: sellersLoading } = useQuery<TopUser[]>({
    queryKey: ["topSellers"],
    queryFn: fetchTopSellers,
  })

  // Fetch top customers
  const { data: topCustomers, isLoading: customersLoading } = useQuery<TopUser[]>({
    queryKey: ["topCustomers"],
    queryFn: fetchTopCustomers,
  })

  return (
    <div className="p-4 xl:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-base-content/60">Tổng quan thống kê người dùng và doanh thu</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
        <StatsCard
          title="Tổng Người Dùng"
          value={userStats?.totalUsers || 0}
          icon={HiUsers}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatsCard
          title="Người Bán (Seller)"
          value={userStats?.totalSellers || 0}
          icon={HiShoppingBag}
          color="text-info"
          bgColor="bg-info/10"
        />
        <StatsCard
          title="Khách Hàng (Customer)"
          value={userStats?.totalCustomers || 0}
          icon={HiUserGroup}
          color="text-success"
          bgColor="bg-success/10"
        />
      </div>

      {/* Registration Chart */}
      <RegistrationChart data={trendData || []} period={period} onPeriodChange={setPeriod} isLoading={trendLoading} />

      {/* Top Users Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6">
        <TopUsersTable
          title="Top 10 Seller Doanh Thu Cao Nhất"
          users={topSellers || []}
          type="seller"
          isLoading={sellersLoading}
        />
        <TopUsersTable
          title="Top 10 Customer Chi Tiêu Cao Nhất"
          users={topCustomers || []}
          type="customer"
          isLoading={customersLoading}
        />
      </div>
    </div>
  )
}

export default Home
