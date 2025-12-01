import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Products from './pages/Products';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Menu from './components/menu/Menu';
import Error from './pages/Error';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import Calendar from './pages/Calendar';
import ToasterProvider from './components/ToasterProvider';
import EditProfile from './pages/EditProfile';
import User from './pages/User';
import Product from './pages/Product';
import Login from './pages/Login';
import UserEdit from './pages/UserEdit';
import CategoryEdit from './pages/CategoryEdit';

// Component bảo vệ route
const ProtectedLayout = () => {
  return (
    <div
      id="rootContainer"
      className="w-full p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between"
    >
      <ToasterProvider />
      <ScrollRestoration />
      <div>
        <Navbar />
        <div className="w-full flex gap-0 pt-20 xl:pt-[96px] 2xl:pt-[112px] mb-auto">
          <div className="hidden xl:block xl:w-[250px] 2xl:w-[280px] 3xl:w-[350px] border-r-2 border-base-300 dark:border-slate-700 px-3 xl:px-4 xl:py-1">
            <Menu />
          </div>
          <div className="w-full px-4 xl:px-4 2xl:px-5 xl:py-2 overflow-clip">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra token khi component mount
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      console.log('App - Checking auth token:', !!token);
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  // Lắng nghe sự thay đổi của authentication
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('App - Auth change event received');
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Hiển thị loading trong khi kiểm tra
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  console.log('App - Authentication state:', isAuthenticated);
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" replace />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/profile',
          element: <Profile />,
        },
        {
          path: '/profile/edit',
          element: <EditProfile />,
        },
        {
          path: '/users',
          element: <Users />,
        },
        {
          path: '/users/:id',
          element: <User />,
        },
        {
          path: '/users/edit/:id',
          element: <UserEdit />,
        },
        {
          path: '/products',
          element: <Products />,
        },
        {
          path: '/products/:id',
          element: <Product />,
        },
        {
          path: '/categories',
          element: <Categories />,
        },
        {
          path: '/categories/edit/:id',
          element: <CategoryEdit />,
        },
        {
          path: '/calendar',
          element: <Calendar />,
        },
      ],
      errorElement: <Error />,
    },
    {
      path: '/login',
      element: !isAuthenticated ? <Login /> : <Navigate to="/" replace />,
    },
    {
      path: '*',
      element: <Navigate to={isAuthenticated ? '/' : '/login'} replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;