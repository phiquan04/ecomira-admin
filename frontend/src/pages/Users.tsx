"use client"

import React from "react"
import type { GridColDef } from "@mui/x-data-grid"
import DataTable from "../components/DataTable"
import { fetchTotalUsers } from "../api/ApiCollection"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import AddData from "../components/AddData"

const Users = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["allusers"],
    queryFn: fetchTotalUsers,
  })

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 40 },
    {
      field: "firstName",
      headerName: "Name",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigo-100">
              <img
                src={params.row.img || "/Portrait_Placeholder.png"}
                alt="user-picture"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-gray-700">
              {params.row.firstName} {params.row.lastName}
            </span>
          </div>
        )
      },
    },
    {
      field: "email",
      type: "string",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "phone",
      type: "string",
      headerName: "Phone",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 100,
      type: "string",
      flex: 1,
    },
    {
      field: "userType",
      headerName: "userType",
      width: 80,
      type: "",
      flex: 1,
    },
  ]

  React.useEffect(() => {
    if (isLoading) {
      toast.loading("Loading...", { id: "promiseUsers" })
    }
    if (isError) {
      toast.error("Error while getting the data!", {
        id: "promiseUsers",
      })
    }
    if (isSuccess) {
      toast.success("Got the data successfully!", {
        id: "promiseUsers",
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
                Users
              </h2>
              {data && data.length > 0 && (
                <span className="text-gray-500 font-medium text-sm">{data.length} Users Found</span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
            >
              Add New User +
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-6">
            {isLoading ? (
              <DataTable slug="users" columns={columns} rows={[]} includeActionColumn={true} />
            ) : isSuccess ? (
              <DataTable slug="users" columns={columns} rows={data} includeActionColumn={true} />
            ) : (
              <>
                <DataTable slug="users" columns={columns} rows={[]} includeActionColumn={true} />
                <div className="w-full flex justify-center py-4 text-red-500 font-medium">
                  Error while getting the data!
                </div>
              </>
            )}
          </div>
        </div>

        {isOpen && <AddData slug={"user"} isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </div>
  )
}

export default Users
