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

// GET ALL CATEGORIES
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

// GET TOTAL PRODUCTS
export const fetchTotalProducts = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalproducts')
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

// GET TOTAL VISIT
export const fetchTotalVisit = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalvisit')
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

// GET ALL PRODUCTS
export const fetchProducts = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/products')
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

// GET SINGLE PRODUCT
export const fetchSingleProduct = async (id: string) => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/products/${id}`)
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
