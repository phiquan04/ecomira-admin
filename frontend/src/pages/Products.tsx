import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { fetchTotalProducts } from '../api/ApiCollection';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const Products = () => {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['allproducts'],
    queryFn: fetchTotalProducts,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      minWidth: 100,
      flex: 1,
      type: 'number',
      valueFormatter: (params) => {
        return `$${params.value}`;
      },
    },
    {
      field: 'stock',
      headerName: 'Stock',
      minWidth: 80,
      flex: 1,
      type: 'number',
    },
    {
      field: 'categoryId',
      headerName: 'Category ID',
      minWidth: 100,
      flex: 1,
      type: 'number',
    },
    {
      field: 'sellerId',
      headerName: 'Seller ID',
      minWidth: 100,
      flex: 1,
      type: 'number',
    },
    {
      field: 'rating',
      headerName: 'Rating',
      minWidth: 80,
      flex: 1,
      type: 'number',
      valueFormatter: (params) => {
        return params.value || 'No rating';
      },
    },
    {
      field: 'soldCount',
      headerName: 'Sold',
      minWidth: 80,
      flex: 1,
      type: 'number',
    },
    {
      field: 'images',
      headerName: 'Image',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        // Lấy ảnh đầu tiên trong mảng images
        const firstImage = params.value && params.value.length > 0 ? params.value[0] : null;
        return (
          <div className="flex gap-3 items-center">
            <div className="avatar">
              <div className="w-6 xl:w-9 rounded-full">
                <img
                  src={firstImage || '/noimage.png'}
                  alt="product"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 80,
      type: 'boolean',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 120,
      type: 'string',
      flex: 1,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('vi-VN');
      },
    },
  ];

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseProducts' });
    }
    if (isError) {
      toast.error('Error while getting the data!', {
        id: 'promiseProducts',
      });
    }
    if (isSuccess) {
      toast.success('Got the data successfully!', {
        id: 'promiseProducts',
      });
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Products
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Products Found
              </span>
            )}
          </div>
        </div>
        {isLoading ? (
          <DataTable
            slug="products"
            columns={columns}
            rows={[]}
            includeActionColumn={true}
          />
        ) : isSuccess ? (
          <DataTable
            slug="products"
            columns={columns}
            rows={data}
            includeActionColumn={true}
          />
        ) : (
          <>
            <DataTable
              slug="products"
              columns={columns}
              rows={[]}
              includeActionColumn={true}
            />
            <div className="w-full flex justify-center">
              Error while getting the data!
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;