import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  user_type: string;
  phone?: string;
  address?: string;
}

const Profile = () => {
  const modalDelete = React.useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-error">Không tìm thấy thông tin người dùng</div>
      </div>
    );
  }

  // Tách fullName thành firstName và lastName
  const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
  const firstName = nameParts[0] || 'Admin';
  const lastName = nameParts.slice(1).join(' ') || 'User';

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-10 xl:gap-8">
        {/* block 1 */}
        <div className="flex items-start justify-between">
          <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
            My Profile
          </h2>
          <button
            onClick={() => navigate('/profile/edit')}
            className="btn text-xs xl:text-sm dark:btn-neutral"
          >
            <HiOutlinePencil className="text-lg" /> Edit My Profile
          </button>
        </div>
        
        {/* block 2 */}
        <div className="flex items-center gap-3 xl:gap-8 xl:mb-4">
          <div className="avatar">
            <div className="w-24 xl:w-36 2xl:w-48 rounded-full">
              <img
                src="https://avatars.githubusercontent.com/u/74099030?v=4"
                alt="admin-avatar"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-semibold text-xl xl:text-3xl">
              {user.fullName}
            </h3>
            <span className="font-normal text-base capitalize">{user.user_type}</span>
          </div>
        </div>
        
        {/* block 3 - Basic Information */}
        <div className="w-full flex flex-col items-stretch gap-3 xl:gap-7">
          <div className="flex items-center w-full gap-3 xl:gap-5">
            <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
              Basic Information
            </h4>
            <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
          </div>
          
          <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-5 xl:gap-5 xl:text-base">
            {/* column 1 */}
            <div className="w-full grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col items-start xl:gap-5">
                <span>First Name*</span>
                <span>Last Name*</span>
                <span>Nickname</span>
              </div>
              <div className="col-span-2 flex flex-col items-start xl:gap-5">
                <span className="font-semibold">{firstName}</span>
                <span className="font-semibold">{lastName}</span>
                <span className="font-semibold">{firstName}</span>
              </div>
            </div>
            
            {/* column 2 */}
            <div className="w-full grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col items-start xl:gap-5">
                <span>Email*</span>
                <span>Phone</span>
                <span>Address</span>
              </div>
              <div className="col-span-2 flex flex-col items-start xl:gap-5">
                <span className="font-semibold">{user.email}</span>
                <span className="font-semibold">{user.phone || 'Chưa cập nhật'}</span>
                <span className="font-semibold">{user.address || 'Chưa cập nhật'}</span>
              </div>
            </div>
            
            {/* column 3 */}
            <div className="w-full grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col items-start xl:gap-5">
                <span>Password</span>
              </div>
              <div className="col-span-2 flex flex-col items-start xl:gap-5">
                <span className="link no-underline link-primary font-semibold">
                  Change Password
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Các phần còn lại giữ nguyên */}
        {/* block 4 - Account Integrations */}
        <div className="w-full flex flex-col items-stretch gap-6 xl:gap-7">
          {/* ... (giữ nguyên code cũ) ... */}
        </div>
        
        {/* block 5 - Delete Account */}
        <div className="w-full flex justify-start items-center mt-10">
          <button
            className="btn dark:btn-neutral text-error dark:text-error text-xs xl:text-sm"
            onClick={() => modalDelete.current?.showModal()}
          >
            <HiOutlineTrash className="text-lg" />
            Delete My Account
          </button>
          <dialog
            id="modal_delete"
            className="modal"
            ref={modalDelete}
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg dark:text-white">
                Action Confirmation!
              </h3>
              <p className="py-4">
                Do you want to delete your account?
              </p>
              <div className="modal-action mx-0 flex-col items-stretch justify-stretch gap-3">
                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user");
                    window.dispatchEvent(new CustomEvent("authChange"));
                    navigate("/login");
                    toast.success('Tài khoản đã được xóa');
                  }}
                  className="btn btn-error btn-block text-base-100 dark:text-white"
                >
                  Yes, I want to delete my account
                </button>
                <form method="dialog" className="m-0 w-full">
                  <button className="m-0 btn btn-block dark:btn-neutral">
                    No, I don't think so
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Profile;