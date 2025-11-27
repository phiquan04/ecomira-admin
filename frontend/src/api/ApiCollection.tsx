import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// GET TOP DEALS
export const fetchTopDeals = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/topdeals')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL USERS
export const fetchTotalUsers = async () => {
  const response = await axios
    .get(`${baseURL}/api/v1/users`)
    .then((res) => {
      console.log('axios get users:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching users:', err);
      throw err;
    });

  return response;
};

// GET SINGLE USER
export const fetchAUser = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/api/v1/users/${id}`)
    .then((res) => {
      console.log('axios get single user:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching single user:', err);
      throw err;
    });

  return response;
};

export const fetchCategories = async () => {
  const response = await axios
    .get(`${baseURL}/api/v1/categories`)
    .then((res) => {
      console.log('axios get categories:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching categories:', err);
      throw err;
    });

  return response;
};

// GET SINGLE CATEGORY
export const fetchSingleCategory = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/api/v1/categories/${id}`)
    .then((res) => {
      console.log('axios get single category:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching single category:', err);
      throw err;
    });

  return response;
};

// ADD NEW CATEGORY
export const addCategory = async (categoryData: {
  name: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
}) => {
  const response = await axios
    .post(`${baseURL}/api/v1/categories`, categoryData)
    .then((res) => {
      console.log('axios post category:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error adding category:', err);
      throw err;
    });

  return response;
};

// UPDATE CATEGORY
export const updateCategory = async (id: string, categoryData: {
  name: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
}) => {
  const response = await axios
    .put(`${baseURL}/api/v1/categories/${id}`, categoryData)
    .then((res) => {
      console.log('axios update category:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error updating category:', err);
      throw err;
    });

  return response;
};

// DELETE CATEGORY
export const deleteCategory = async (id: string) => {
  const response = await axios
    .delete(`${baseURL}/api/v1/categories/${id}`)
    .then((res) => {
      console.log('axios delete category:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error deleting category:', err);
      throw err;
    });

  return response;
};

// GET TOTAL RATIO
export const fetchTotalRatio = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalratio')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL REVENUE
export const fetchTotalRevenue = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalrevenue')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL SOURCE
export const fetchTotalSource = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalsource')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

export const fetchTotalProducts = async () => {
  const response = await axios
    .get(`${baseURL}/api/v1/products`)
    .then((res) => {
      console.log('axios get products:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching products:', err);
      throw err;
    });

  return response;
};

// GET SINGLE PRODUCT
export const fetchSingleProduct = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/api/v1/products/${id}`)
    .then((res) => {
      console.log('axios get single product:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching single product:', err);
      throw err;
    });

  return response;
};

// GET TOTAL VISIT
// export const fetchTotalVisit = async () => {
//   const response = await axios
//     .get('https://react-admin-ui-v1-api.vercel.app/totalvisit')
//     .then((res) => {
//       console.log('axios get:', res.data);
//       return res.data;
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });

//   return response;
// };

// GET TOTAL REVENUE BY PRODUCTS
export const fetchTotalRevenueByProducts = async () => {
  const response = await axios
    .get(
      'https://react-admin-ui-v1-api.vercel.app/totalrevenue-by-product'
    )
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL PROFIT
export const fetchTotalProfit = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalprofit')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL USERS
export const fetchUsers = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/users')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET SINGLE USER
export const fetchSingleUser = async (id: string) => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/users/${id}`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};


// GET ALL ORDERS
export const fetchOrders = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/orders')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL POSTS
export const fetchPosts = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/posts')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL NOTES
export const fetchNotes = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/notes?q=`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL LOGS
export const fetchLogs = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/logs`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};
// ADD NEW USER
export const addUser = async (userData: {
  fullName: string;
  email: string;
  phone: string;
  userType: string;
  isVerified: boolean;
}) => {
  const response = await axios
    .post(`${baseURL}/api/v1/users`, userData)
    .then((res) => {
      console.log('axios post user:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error adding user:', err);
      throw err;
    });

  return response;
};

// UPDATE USER
export const updateUser = async (id: string, userData: {
  fullName: string;
  email: string;
  phone: string;
  userType: string;
  isVerified: boolean;
}) => {
  const response = await axios
    .put(`${baseURL}/api/v1/users/${id}`, userData)
    .then((res) => {
      console.log('axios update user:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error updating user:', err);
      throw err;
    });

  return response;
};

// DELETE USER
export const deleteUser = async (id: string) => {
  const response = await axios
    .delete(`${baseURL}/api/v1/users/${id}`)
    .then((res) => {
      console.log('axios delete user:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error deleting user:', err);
      throw err;
    });

  return response;
};

// GET USER PROFILE
export const fetchUserProfile = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/api/v1/users/${id}`)
    .then((res) => {
      console.log('axios get user profile:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching user profile:', err);
      throw err;
    });

  return response;
};

// UPDATE USER PROFILE
export const updateUserProfile = async (id: string, userData: {
  fullName: string;
  email: string;
  phone: string;
  user_type: string;
}) => {
  const response = await axios
    .put(`${baseURL}/api/v1/users/${id}`, userData)
    .then((res) => {
      console.log('axios update user profile:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error updating user profile:', err);
      throw err;
    });

  return response;
};

// CHANGE PASSWORD
export const changePassword = async (id: string, passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axios
    .post(`${baseURL}/api/auth/change-password`, {
      userId: id,
      ...passwordData
    })
    .then((res) => {
      console.log('axios change password:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error changing password:', err);
      throw err;
    });

  return response;
};


// GET REVENUE DATA
export const fetchRevenueData = async () => {
  const response = await axios
    .get(`${baseURL}/api/analytics/revenue-data`)
    .then((res) => {
      console.log('axios get revenue data:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching revenue data:', err);
      throw err;
    });

  return response;
};

// GET ORDER STATISTICS
export const fetchOrderStats = async () => {
  const response = await axios
    .get(`${baseURL}/api/analytics/order-stats`)
    .then((res) => {
      console.log('axios get order stats:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching order stats:', err);
      throw err;
    });

  return response;
};

// GET SELLER STATISTICS
export const fetchSellerStats = async () => {
  const response = await axios
    .get(`${baseURL}/api/analytics/seller-stats`) // Đổi thành route đúng
    .then((res) => {
      console.log('axios get seller stats:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching seller stats:', err);
      throw err;
    });

  return response;
};

// GET BUYER STATISTICS
export const fetchBuyerStats = async () => {
  const response = await axios
    .get(`${baseURL}/api/analytics/buyer-stats`) // Đổi thành route đúng
    .then((res) => {
      console.log('axios get buyer stats:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching buyer stats:', err);
      throw err;
    });

  return response;
};

// GET USER REGISTRATION TRENDS
export const fetchUserRegistrations = async () => {
  const response = await axios
    .get(`${baseURL}/api/analytics/user-registrations`) // Đổi thành route đúng
    .then((res) => {
      console.log('axios get user registrations:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching user registrations:', err);
      throw err;
    });

  return response;
};

// GET PRODUCT REGISTRATION TRENDS
export const fetchProductRegistrations = async () => {
  const response = await axios
    .get(`${baseURL}/api/analytics/product-registrations`) // Đổi thành route đúng
    .then((res) => {
      console.log('axios get product registrations:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching product registrations:', err);
      throw err;
    });

  return response;
};

// GET SELLER STATS BY USER ID
export const fetchSellerStatsByUserId = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/api/v1/users/${id}/seller-stats`)
    .then((res) => {
      console.log('axios get seller stats by user id:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching seller stats by user id:', err);
      throw err;
    });

  return response;
};

// GET CUSTOMER STATS BY USER ID
export const fetchCustomerStatsByUserId = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/api/v1/users/${id}/customer-stats`)
    .then((res) => {
      console.log('axios get customer stats by user id:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching customer stats by user id:', err);
      throw err;
    });

  return response;
};

// GET SELLER REVENUE CHART DATA BY USER ID
export const fetchSellerRevenueChart = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/api/v1/users/${id}/seller-revenue-chart`)
    .then((res) => {
      console.log('axios get seller revenue chart:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching seller revenue chart:', err);
      throw err;
    });

  return response;
};

// GET CUSTOMER ACTIVITY CHART DATA BY USER ID
export const fetchCustomerActivityChart = async (id: string) => {
  const response = await axios
    .get(`${baseURL}/api/v1/users/${id}/customer-activity-chart`)
    .then((res) => {
      console.log('axios get customer activity chart:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log('Error fetching customer activity chart:', err);
      throw err;
    });

  return response;
};