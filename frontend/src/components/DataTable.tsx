import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteUser, deleteCategory } from '../api/ApiCollection';

interface DataTableProps {
  slug: string;
  columns: GridColDef[];
  rows: object[];
  includeActionColumn?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  slug,
  columns,
  rows,
  includeActionColumn = false,
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (slug === 'users') {
        return deleteUser(id);
      } else if (slug === 'categories') {
        return deleteCategory(id);
      }
      throw new Error('Invalid slug');
    },
    onSuccess: () => {
      toast.success(`${slug.slice(0, -1)} deleted successfully!`);
      queryClient.invalidateQueries({ 
        queryKey: slug === 'users' ? ['allusers'] : ['allcategories'] 
      });
    },
    onError: (error: any) => {
      toast.error(`Error deleting ${slug.slice(0, -1)}: ${error.response?.data?.error || error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${slug.slice(0, -1)}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const actionColumn: GridColDef = {
    field: 'action',
    headerName: 'Action',
    width: 200,
    renderCell: (params) => {
      return (
        <div className="flex gap-2">
          <Link to={`/${slug}/${params.row.id}`}>
            <button className="btn btn-info btn-sm">View</button>
          </Link>
          <Link to={`/${slug}/edit/${params.row.id}`}>
            <button className="btn btn-warning btn-sm">Edit</button>
          </Link>
          <button
            className="btn btn-error btn-sm"
            onClick={() => handleDelete(params.row.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      );
    },
  };

  const columnsWithActions = includeActionColumn
    ? [...columns, actionColumn]
    : columns;

  return (
    <div className="w-full h-[600px]">
      <DataGrid
        className="bg-base-100 dark:bg-neutral p-4"
        rows={rows}
        columns={columnsWithActions}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default DataTable;