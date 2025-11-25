"use client"

import React from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { fetchSingleUser } from "../api/ApiCollection"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

const User = () => {
  const tempEntries: number[] = [1, 2, 3, 4, 5]
  const dataLine = [
    { name: "Jan", purchased: 4000, wishlisted: 2400, amt: 2400 },
    { name: "Feb", purchased: 3000, wishlisted: 1398, amt: 2210 },
    { name: "Mar", purchased: 2000, wishlisted: 9800, amt: 2290 },
    { name: "Apr", purchased: 2780, wishlisted: 3908, amt: 2000 },
    { name: "May", purchased: 1890, wishlisted: 4800, amt: 2181 },
    { name: "Jun", purchased: 2390, wishlisted: 3800, amt: 2500 },
    { name: "Jul", purchased: 3490, wishlisted: 4300, amt: 2100 },
  ]

  const { id } = useParams()

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchSingleUser(id || ""),
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
      <div className="max-w-7xl mx-auto grid xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Profile Card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <div className="p-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                {isLoading ? (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse"></div>
                ) : isSuccess ? (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-lg">
                      <img src={data.img || "/placeholder.svg"} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-1">
                  {isLoading ? (
                    <div className="w-48 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg animate-pulse"></div>
                  ) : isSuccess ? (
                    <h3 className="font-bold text-2xl text-gray-800">
                      {data.firstName} {data.lastName}
                    </h3>
                  ) : null}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-indigo-700 w-fit">
                    Member
                  </span>
                </div>
              </div>

              {/* Details */}
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : isSuccess ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">First Name</span>
                    <p className="text-gray-800 font-medium mt-1">{data.firstName}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Last Name</span>
                    <p className="text-gray-800 font-medium mt-1">{data.lastName}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Email</span>
                    <p className="text-gray-800 font-medium mt-1">{data.email}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Phone</span>
                    <p className="text-gray-800 font-medium mt-1">{data.phone}</p>
                  </div>
                  <div className="col-span-2 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Status</span>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          data.verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {data.verified ? "✓ Verified" : "✗ Not Verified"}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Chart Card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <div className="p-6">
              <h4 className="font-semibold text-lg text-gray-800 mb-4">Activity Chart</h4>
              {isLoading ? (
                <div className="w-full h-[300px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl animate-pulse"></div>
              ) : isSuccess ? (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataLine}>
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
                  </ResponsiveContainer>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Column - Activities */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Latest Activities
            </h2>

            {isLoading &&
              tempEntries.map((index: number) => (
                <div
                  key={index}
                  className="w-full h-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-3 animate-pulse"
                ></div>
              ))}

            {isSuccess && (
              <div className="space-y-4">
                {[
                  {
                    text: `${data.firstName} ${data.lastName} purchased Playstation 5 Digital Edition`,
                    time: "3 days ago",
                    color: "from-blue-50 to-indigo-50",
                  },
                  {
                    text: `${data.firstName} ${data.lastName} added 3 items into wishlist`,
                    time: "1 week ago",
                    color: "from-indigo-50 to-purple-50",
                  },
                  {
                    text: `${data.firstName} ${data.lastName} purchased Samsung 4K UHD SmartTV`,
                    time: "2 weeks ago",
                    color: "from-purple-50 to-pink-50",
                  },
                  {
                    text: `${data.firstName} ${data.lastName} commented a post`,
                    time: "3 weeks ago",
                    color: "from-pink-50 to-blue-50",
                  },
                  {
                    text: `${data.firstName} ${data.lastName} added 1 item into wishlist`,
                    time: "1 month ago",
                    color: "from-blue-50 to-indigo-50",
                  },
                ].map((activity, idx) => (
                  <div
                    key={idx}
                    className={`p-4 bg-gradient-to-br ${activity.color} rounded-xl border border-indigo-100`}
                  >
                    <p className="text-gray-700 font-medium">{activity.text}</p>
                    <span className="text-xs text-gray-500 mt-2 block">{activity.time}</span>
                  </div>
                ))}
              </div>
            )}

            {isError &&
              tempEntries.map((index: number) => (
                <div key={index} className="w-full h-20 bg-red-50 rounded-xl mb-3"></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
