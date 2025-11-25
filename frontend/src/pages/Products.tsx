"use client"

import React from "react"
import type { GridColDef } from "@mui/x-data-grid"
import DataTable from "../components/DataTable"
import { fetchTotalProducts } from "../api/ApiCollection"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

const Products = () => {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["allproducts"],
    queryFn: fetchTotalProducts,
  })

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 1,
      type: "number",
      valueFormatter: (params) => `$${params.value}`,
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 80,
      flex: 1,
      type: "number",
    },
    {
      field: "categoryId",
      headerName: "Category ID",
      minWidth: 100,
      flex: 1,
      type: "number",
    },
    {
      field: "sellerId",
      headerName: "Seller ID",
      minWidth: 100,
      flex: 1,
      type: "number",
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 80,
      flex: 1,
      type: "number",
      valueFormatter: (params) => params.value || "No rating",
    },
    {
      field: "soldCount",
      headerName: "Sold",
      minWidth: 80,
      flex: 1,
      type: "number",
    },
    {
      field: "images",
      headerName: "Image",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        const firstImage = params.value && params.value.length > 0 ? params.value[0] : null
        return (
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigo-100">
              <img src={firstImage || "/noimage.png"} alt="product" className="w-full h-full object-cover" />
            </div>
          </div>
        )
      },
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 80,
      type: "boolean",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 120,
      type: "string",
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString("vi-VN"),
    },
  ]

  React.useEffect(() => {
    if (isLoading) {
      toast.loading("Loading...", { id: "promiseProducts" })
    }
    if (isError) {
      toast.error("Error while getting the data!", { id: "promiseProducts" })
    }
    if (isSuccess) {
      toast.success("Got the data successfully!", { id: "promiseProducts" })
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
                Products
              </h2>
              {data && data.length > 0 && (
                <span className="text-gray-500 font-medium text-sm">{data.length} Products Found</span>
              )}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-6">
            {isLoading ? (
              <DataTable slug="products" columns={columns} rows={[]} includeActionColumn={true} />
            ) : isSuccess ? (
              <DataTable slug="products" columns={columns} rows={data} includeActionColumn={true} />
            ) : (
              <>
                <DataTable slug="products" columns={columns} rows={[]} includeActionColumn={true} />
                <div className="w-full flex justify-center py-4 text-red-500 font-medium">
                  Error while getting the data!
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
