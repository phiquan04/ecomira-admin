"use client"

import React from "react"
import type { GridColDef } from "@mui/x-data-grid"
import DataTable from "../components/DataTable"
import { fetchCategories } from "../api/ApiCollection"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import AddData from "../components/AddData"
import IconRenderer from "../components/IconRenderer"

const Categories = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["allcategories"],
    queryFn: fetchCategories,
  })

  // Lọc categories theo name
  const filteredCategories = React.useMemo(() => {
    if (!data) return []
    return data.filter((category: any) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [data, searchTerm])

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "icon",
      headerName: "Icon",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex gap-3 items-center">
            <IconRenderer iconName={params.row.icon} size={24} color={params.row.color} withBackground={true} />
          </div>
        )
      },
    },
    {
      field: "color",
      headerName: "Color",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex gap-3 items-center">
            <div
              className="w-6 h-6 rounded-lg border-2 border-gray-200 shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: params.row.color }}
            ></div>
            <span className="text-sm font-mono font-medium text-gray-700">{params.row.color}</span>
          </div>
        )
      },
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 120,
      flex: 1,
      renderCell: (params) => {
        return (
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              params.value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${params.value ? "bg-green-500" : "bg-red-500"}`}></span>
            {params.value ? "Active" : "Inactive"}
          </span>
        )
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 120,
      type: "string",
      flex: 1,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString("vi-VN")
      },
    },
  ]

  React.useEffect(() => {
    if (isLoading) {
      toast.loading("Loading...", { id: "promiseCategories" })
    }
    if (isError) {
      toast.error("Error while getting the data!", {
        id: "promiseCategories",
      })
    }
    if (isSuccess) {
      toast.success("Got the data successfully!", {
        id: "promiseCategories",
      })
    }
  }, [isError, isLoading, isSuccess])

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-bold text-2xl xl:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Categories
              </h2>
              {filteredCategories && filteredCategories.length > 0 && (
                <span className="text-gray-500 font-medium text-sm">
                  {filteredCategories.length} {filteredCategories.length === 1 ? "Category" : "Categories"} Found
                </span>
              )}
            </div>

            <div className="flex gap-4 items-center">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(true)}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
              >
                Add New Category +
              </button>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-6">
            {isLoading ? (
              <DataTable slug="categories" columns={columns} rows={[]} includeActionColumn={true} />
            ) : isSuccess ? (
              <DataTable slug="categories" columns={columns} rows={filteredCategories} includeActionColumn={true} />
            ) : (
              <>
                <DataTable slug="categories" columns={columns} rows={[]} includeActionColumn={true} />
                <div className="w-full flex justify-center py-4 text-red-500 font-medium">
                  Error while getting the data!
                </div>
              </>
            )}
          </div>
        </div>

        {isOpen && <AddData slug={"category"} isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </div>
  )
}

export default Categories
