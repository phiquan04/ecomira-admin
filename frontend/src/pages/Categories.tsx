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
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["allcategories"],
    queryFn: fetchCategories,
  })

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerClassName: "font-semibold bg-base-200 dark:bg-neutral",
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      headerClassName: "font-semibold bg-base-200 dark:bg-neutral",
    },
    {
      field: "icon",
      headerName: "Icon",
      minWidth: 100,
      flex: 1,
      headerClassName: "font-semibold bg-base-200 dark:bg-neutral",
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
      headerClassName: "font-semibold bg-base-200 dark:bg-neutral",
      renderCell: (params) => {
        return (
          <div className="flex gap-3 items-center">
            <div
              className="w-6 h-6 rounded-lg border-2 border-base-300 shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: params.row.color }}
            ></div>
            <span className="text-sm font-mono font-medium">{params.row.color}</span>
          </div>
        )
      },
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1,
      headerClassName: "font-semibold bg-base-200 dark:bg-neutral",
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 80,
      type: "boolean",
      flex: 1,
      headerClassName: "font-semibold bg-base-200 dark:bg-neutral",
      renderCell: (params) => {
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              params.value
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {params.value ? "✓ Active" : "✗ Inactive"}
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
      headerClassName: "font-semibold bg-base-200 dark:bg-neutral",
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
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-6">
        <div className="w-full flex justify-between items-center mb-2">
          <div className="flex gap-2 justify-start flex-col items-start">
            <h2 className="font-bold text-3xl xl:text-4xl text-base-content dark:text-neutral-200">Categories</h2>
            {data && data.length > 0 && (
              <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                {data.length} {data.length === 1 ? "Category" : "Categories"} Found
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all ${
              isLoading ? "btn-disabled" : ""
            }`}
          >
            <span className="text-lg">+</span>
            Add New Category
          </button>
        </div>

        <div className="w-full bg-base-100 dark:bg-base-200 rounded-xl shadow-md overflow-hidden border border-base-200 dark:border-base-300">
          {isLoading ? (
            <DataTable slug="categories" columns={columns} rows={[]} includeActionColumn={true} />
          ) : isSuccess ? (
            <DataTable slug="categories" columns={columns} rows={data} includeActionColumn={true} />
          ) : (
            <>
              <DataTable slug="categories" columns={columns} rows={[]} includeActionColumn={true} />
              <div className="w-full flex justify-center items-center py-16">
                <div className="text-center">
                  <span className="text-red-500 font-semibold text-lg">⚠️ Error</span>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Failed to load categories</p>
                </div>
              </div>
            </>
          )}
        </div>

        {isOpen && <AddData slug={"category"} isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </div>
  )
}

export default Categories
