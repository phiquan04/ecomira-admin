// Home.tsx
import ChartBox from '../components/charts/ChartBox';
import { useQuery } from '@tanstack/react-query';
import {
  MdAttachMoney,
  MdShoppingCart,
  MdPeople,
  MdAccountCircle,
  MdAddBox
} from 'react-icons/md';
import {
  fetchSellerStats,
  fetchBuyerStats,
  fetchUserRegistrations,
  fetchProductRegistrations
} from '../api/ApiCollection';

const Home = () => {
  // Query for seller statistics
  const querySellerStats = useQuery({
    queryKey: ['sellerStats'],
    queryFn: fetchSellerStats,
  });

  // Query for buyer statistics
  const queryBuyerStats = useQuery({
    queryKey: ['buyerStats'],
    queryFn: fetchBuyerStats,
  });

  // Query for user registration trends
  const queryUserRegistrations = useQuery({
    queryKey: ['userRegistrations'],
    queryFn: fetchUserRegistrations,
  });

  // Query for product registration trends
  const queryProductRegistrations = useQuery({
    queryKey: ['productRegistrations'],
    queryFn: fetchProductRegistrations,
  });

  return (
    <div className="home w-full p-0 m-0">
      {/* Two columns layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Seller Statistics Column */}
        <div className="bg-base-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MdAccountCircle className="text-primary" />
            Thống kê Người bán
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="stat bg-base-100 rounded-lg p-4">
              <div className="stat-figure text-primary">
                <MdAttachMoney className="text-3xl" />
              </div>
              <div className="stat-title">Tổng doanh thu</div>
              <div className="stat-value text-primary">
                {querySellerStats.isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : querySellerStats.isError ? (
                  <span className="text-error">Lỗi</span>
                ) : querySellerStats.isSuccess ? (
                  `$${querySellerStats.data.totalRevenue.toLocaleString()}`
                ) : (
                  'N/A'
                )}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-lg p-4">
              <div className="stat-figure text-secondary">
                <MdShoppingCart className="text-3xl" />
              </div>
              <div className="stat-title">Đơn hàng đã bán</div>
              <div className="stat-value text-secondary">
                {querySellerStats.isLoading ? (
                  <div className="skeleton h-8 w-20"></div>
                ) : querySellerStats.isError ? (
                  <span className="text-error">Lỗi</span>
                ) : querySellerStats.isSuccess ? (
                  querySellerStats.data.totalOrders.toLocaleString()
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Statistics Column */}
        <div className="bg-base-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MdPeople className="text-accent" />
            Thống kê Người mua
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="stat bg-base-100 rounded-lg p-4">
              <div className="stat-figure text-accent">
                <MdShoppingCart className="text-3xl" />
              </div>
              <div className="stat-title">Tổng đơn mua</div>
              <div className="stat-value text-accent">
                {queryBuyerStats.isLoading ? (
                  <div className="skeleton h-8 w-20"></div>
                ) : queryBuyerStats.isError ? (
                  <span className="text-error">Lỗi</span>
                ) : queryBuyerStats.isSuccess ? (
                  queryBuyerStats.data.totalOrders.toLocaleString()
                ) : (
                  'N/A'
                )}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-lg p-4">
              <div className="stat-figure text-info">
                <MdAttachMoney className="text-3xl" />
              </div>
              <div className="stat-title">Tổng chi tiêu</div>
              <div className="stat-value text-info">
                {queryBuyerStats.isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : queryBuyerStats.isError ? (
                  <span className="text-error">Lỗi</span>
                ) : queryBuyerStats.isSuccess ? (
                  `$${queryBuyerStats.data.totalSpent.toLocaleString()}`
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* User Registration Chart */}
        <div className="box">
          <ChartBox
            chartType={'bar'}
            title="Đăng ký tài khoản"
            color="#8884d8"
            {...queryUserRegistrations.data}
            isLoading={queryUserRegistrations.isLoading}
            isSuccess={queryUserRegistrations.isSuccess && !queryUserRegistrations.isError}
          />
        </div>

        {/* Product Registration Chart */}
        <div className="box">
          <ChartBox
            chartType={'line'}
            title="Đăng ký sản phẩm"
            color="#82ca9d"
            IconBox={MdAddBox}
            {...queryProductRegistrations.data}
            isLoading={queryProductRegistrations.isLoading}
            isSuccess={queryProductRegistrations.isSuccess && !queryProductRegistrations.isError}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;