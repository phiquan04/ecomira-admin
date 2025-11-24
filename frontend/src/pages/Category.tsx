import React from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleCategory } from '../api/ApiCollection';
import IconRenderer from '../components/IconRenderer'; // Thêm import

const Category = () => {
  const { id } = useParams();

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ['category', id],
    queryFn: () => fetchSingleCategory(id || ''),
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
                  <div 
                    className="p-4 rounded-2xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: data.color + '20', // 20 = 12% opacity
                      color: data.color 
                    }}
                  >
                    <IconRenderer 
                      iconName={data.icon} 
                      size={80}
                      className="text-6xl xl:text-8xl"
                    />
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
                    Category
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
                    <span className="font-medium">Name</span>
                    <span className="font-medium">Icon</span>
                    <span className="font-medium">Color</span>
                    <span className="font-medium">Description</span>
                    <span className="font-medium">Active</span>
                    <span className="font-medium">Created At</span>
                  </div>
                  <div className="col-span-2 flex flex-col items-start gap-3 xl:gap-5">
                    <span className="font-semibold">
                      {data.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <IconRenderer 
                        iconName={data.icon} 
                        size={24}
                      />
                      <span className="font-semibold">
                        {data.icon}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: data.color }}
                      ></div>
                      <span className="font-semibold">
                        {data.color}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {data.description}
                    </span>
                    <span className={`font-semibold ${data.isActive ? 'text-green-600' : 'text-red-600'}`}>
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
        
        {/* Thêm phần thống kê hoặc thông tin bổ sung nếu cần */}
        <div className="w-full flex flex-col items-start gap-5">
          <h3 className="text-xl font-semibold dark:text-white">
            Category Statistics
          </h3>
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-base-200 dark:bg-neutral p-4 rounded-lg">
              <span className="text-sm text-gray-500">Total Products</span>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-base-200 dark:bg-neutral p-4 rounded-lg">
              <span className="text-sm text-gray-500">Active Products</span>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;