import React from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleProduct } from '../api/ApiCollection';

const Product = () => {
  const { id } = useParams();

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchSingleProduct(id || ''),
  });

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseRead' });
    }
    if (isError) {
      toast.error('Error while getting the data!', {
        id: 'promiseRead',
      });
    }
    if (isSuccess) {
      toast.success('Read the data successfully!', {
        id: 'promiseRead',
      });
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full grid xl:grid-cols-2 gap-10 mt-5 xl:mt-0">
        <div className="w-full flex flex-col items-start gap-10">
          <div className="w-full flex flex-col items-start gap-5">
            <div className="w-full flex items-center gap-3">
              <div className="flex items-center gap-3 xl:gap-8 xl:mb-4">
                {isLoading ? (
                  <div className="w-24 xl:w-36 h-24 xl:h-36 rounded-full skeleton dark:bg-neutral"></div>
                ) : isSuccess ? (
                  <div className="w-24 xl:w-36 rounded-full">
                    <img src={data.imageUrl || '/noimage.png'} alt="product" />
                  </div>
                ) : (
                  ''
                )}
                <div className="flex flex-col items-start gap-1">
                  {isLoading ? (
                    <div className="w-[200px] h-[36px] skeleton dark:bg-neutral"></div>
                  ) : isSuccess ? (
                    <h3 className="font-semibold text-xl xl:text-3xl dark:text-white">
                      {data.name}
                    </h3>
                  ) : (
                    <div className="w-[200px] h-[36px] skeleton dark:bg-neutral"></div>
                  )}
                  <span className="font-normal text-base">
                    Product
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full flex gap-8">
              {isLoading ? (
                <div className="w-full xl:w-[50%} h-52 skeleton dark:bg-neutral"></div>
              ) : isSuccess ? (
                <div className="w-full grid grid-cols-3 xl:flex gap-5 xl:gap-8">
                  <div className="col-span-1 flex flex-col items-start gap-3 xl:gap-5">
                    <span>Name</span>
                    <span>Description</span>
                    <span>Price</span>
                    <span>Stock Quantity</span>
                    <span>Category ID</span>
                    <span>Active</span>
                    <span>Created At</span>
                  </div>
                  <div className="col-span-2 flex flex-col items-start gap-3 xl:gap-5">
                    <span className="font-semibold">
                      {data.name}
                    </span>
                    <span className="font-semibold">
                      {data.description}
                    </span>
                    <span className="font-semibold">
                      ${data.price}
                    </span>
                    <span className="font-semibold">
                      {data.stockQuantity}
                    </span>
                    <span className="font-semibold">
                      {data.categoryId}
                    </span>
                    <span className="font-semibold">
                      {data.isActive ? 'Yes' : 'No'}
                    </span>
                    <span className="font-semibold">
                      {new Date(data.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full xl:w-[50%} h-52 skeleton dark:bg-neutral"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;