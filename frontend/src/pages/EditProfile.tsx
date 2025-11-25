import React, { ChangeEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { updateUserProfile, changePassword, fetchUserProfile } from '../api/ApiCollection';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  user_type: string;
  phone?: string;
  address?: string;
}

const EditProfile = () => {
  const modalDelete = React.useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  // State cho form thông tin
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // State cho form đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch thông tin đầy đủ từ server
  const { data: userFullData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => fetchUserProfile(user?.id || ''),
    enabled: !!user?.id,
  });

  // Khi có dữ liệu từ server, cập nhật state user và form
  useEffect(() => {
    if (userFullData) {
      setUser(userFullData);
      
      // Điền dữ liệu vào form
      const nameParts = userFullData.fullName ? userFullData.fullName.split(' ') : ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setNickName(nameParts[0] || '');
      setEmail(userFullData.email || '');
      setPhone(userFullData.phone || '');
      setAddress(userFullData.address || '');
      
      setLoading(false);
    }
  }, [userFullData]);

  // Mutation để cập nhật thông tin user
  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: any) => updateUserProfile(user?.id || '', updatedData),
    onSuccess: (data) => {
      // Cập nhật localStorage với user_type hiện tại
      const updatedUser = { 
        ...user, 
        ...data,
        user_type: user?.user_type // Giữ nguyên user_type
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Thông tin đã được cập nhật');
      navigate('/profile');
    },
    onError: (error: any) => {
      toast.error('Cập nhật thất bại: ' + (error.response?.data?.message || error.message));
    }
  });

  // Mutation để đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: any) => changePassword(user?.id || '', passwordData),
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công');
      // Reset form đổi mật khẩu
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    },
    onError: (error: any) => {
      toast.error('Đổi mật khẩu thất bại: ' + (error.response?.data?.message || error.message));
    }
  });

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUpload = e.target.files[0];
      setSelectedFile(imageUpload);
      setPreview(URL.createObjectURL(imageUpload));
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!user) return;

    const updatedData = {
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      user_type: user.user_type // Đảm bảo gửi user_type hiện tại
    };

    updateProfileMutation.mutate(updatedData);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword,
      newPassword
    });
  };

  if (loading || isLoadingUser) {
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

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-7 xl:gap-8">
        {/* block 1 */}
        <div className="flex flex-col xl:flex-row items-start justify-between gap-3 xl:gap-0">
          <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
            Edit Profile
          </h2>
          <div className="w-full xl:w-auto grid grid-cols-2 xl:flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-block xl:w-auto dark:btn-neutral"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="btn btn-block xl:w-auto btn-primary"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* block 2 */}
        <div className="flex items-center gap-3 xl:gap-8 xl:mb-4">
          <div className="relative inline-flex">
            <button
              onClick={handleIconClick}
              className="btn btn-circle btn-sm xl:btn-md top-0 right-0 absolute z-[1]"
            >
              <HiOutlinePencil className="text-xs xl:text-lg" />
            </button>
            <div className="avatar">
              <div className="w-24 xl:w-36 2xl:w-48 rounded-full">
                <img
                  src={
                    preview ||
                    'https://avatars.githubusercontent.com/u/74099030?v=4'
                  }
                  alt="admin-avatar"
                />
              </div>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-start gap-1">
            <h3 className="font-semibold text-xl xl:text-3xl">
              {firstName} {lastName}
            </h3>
            <span className="font-normal text-base capitalize">{user.user_type}</span>
          </div>
        </div>

        {/* block 3 - Form thông tin cơ bản */}
        <div className="w-full flex flex-col items-stretch gap-3 xl:gap-7">
          <div className="flex items-center w-full gap-3 xl:gap-5">
            <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
              Basic Information
            </h4>
            <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
          </div>
          
          <div className="w-full grid xl:grid-cols-3 gap-3 xl:gap-5 2xl:gap-20 xl:text-base">
            {/* column 1 */}
            <div className="w-full flex flex-col sm:grid sm:grid-cols-3 xl:flex xl:flex-col gap-3 xl:gap-5">
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span>First Name*</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full col-span-2 2xl:col-span-3"
                />
              </div>
              
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span>Last Name*</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full col-span-2 2xl:col-span-3"
                />
              </div>
              
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span>Nickname</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  className="input input-bordered w-full col-span-2 2xl:col-span-3"
                />
              </div>
            </div>

            {/* column 2 */}
            <div className="w-full flex flex-col sm:grid sm:grid-cols-2 xl:flex xl:flex-col gap-3 xl:gap-5">
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span>Email*</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full col-span-2 2xl:col-span-3"
                />
              </div>
              
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span>Phone</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input input-bordered w-full col-span-2 2xl:col-span-3"
                />
              </div>
              
              <div className="w-full grid sm:col-span-full xl:grid-cols-3 2xl:grid-cols-4 xl:items-start gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap xl:mt-3">
                  <span>Address</span>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full col-span-2 2xl:col-span-3"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* column 3 - Change Password Button */}
            <div className="w-full flex flex-col sm:grid sm:grid-cols-3 xl:flex xl:flex-col gap-3 xl:gap-5">
              <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                <div className="w-full whitespace-nowrap">
                  <span>Password</span>
                </div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="btn btn-primary col-span-2 2xl:col-span-3"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* block 4 - Form đổi mật khẩu */}
        {showPasswordForm && (
          <div className="w-full flex flex-col items-stretch gap-3 xl:gap-7">
            <div className="flex items-center w-full gap-3 xl:gap-5">
              <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
                Change Password
              </h4>
              <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
            </div>
            
            <div className="w-full grid xl:grid-cols-3 gap-3 xl:gap-5 2xl:gap-20 xl:text-base">
              <div className="w-full flex flex-col sm:grid sm:grid-cols-3 xl:flex xl:flex-col gap-3 xl:gap-5">
                <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                  <div className="w-full whitespace-nowrap">
                    <span>Current Password</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input input-bordered w-full col-span-2 2xl:col-span-3"
                  />
                </div>
                
                <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                  <div className="w-full whitespace-nowrap">
                    <span>New Password</span>
                  </div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input input-bordered w-full col-span-2 2xl:col-span-3"
                  />
                </div>
                
                <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                  <div className="w-full whitespace-nowrap">
                    <span>Confirm Password</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input input-bordered w-full col-span-2 2xl:col-span-3"
                  />
                </div>
                
                <div className="w-full grid xl:grid-cols-3 2xl:grid-cols-4 items-center gap-1 xl:gap-0">
                  <div className="w-full whitespace-nowrap"></div>
                  <button
                    onClick={handleChangePassword}
                    disabled={changePasswordMutation.isPending}
                    className="btn btn-primary col-span-2 2xl:col-span-3"
                  >
                    {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Các phần còn lại giữ nguyên */}
        {/* block 5 - Account Integrations */}
        <div className="w-full flex flex-col items-stretch gap-6 xl:gap-7">
          {/* ... (giữ nguyên code cũ) ... */}
        </div>

        {/* block 6 - Delete Account */}
        <div className="w-full flex justify-start items-center mt-10">
          <button
            className="btn btn-disabled text-error text-xs xl:text-sm"
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

export default EditProfile;