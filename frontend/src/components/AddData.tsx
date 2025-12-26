import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addUser, updateUser, addCategory, updateCategory } from '../api/ApiCollection';

interface AddDataProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?: any; 
}

const AddData: React.FC<AddDataProps> = ({ slug, isOpen, setIsOpen, editData }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        // Đảm bảo avatar được lấy từ editData
        avatar: editData.avatar || editData.img || '',
      });
    } else {
      setFormData(slug === 'user' ? {
        fullName: '',
        email: '',
        phone: '',
        userType: 'seller',
        password: '',
        isVerified: false,
        avatar: ''  // Thêm field avatar
      } : {
        name: '',
        icon: '',
        color: '#3b82f6',
        description: '',
        isActive: true
      });
    }
  }, [editData, slug]);

  const userMutation = useMutation({
    mutationFn: editData
      ? (data: any) => updateUser(editData.id, data)
      : (data: any) => addUser(data),
    onSuccess: () => {
      toast.success(`User ${editData ? 'updated' : 'added'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allusers'] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const categoryMutation = useMutation({
    mutationFn: editData
      ? (data: any) => updateCategory(editData.id, data)
      : (data: any) => addCategory(data),
    onSuccess: () => {
      toast.success(`Category ${editData ? 'updated' : 'added'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['allcategories'] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (slug === 'user') {
      userMutation.mutate(formData);
    } else if (slug === 'category') {
      categoryMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {editData ? `Edit ${slug}` : `Add New ${slug}`}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {slug === 'user' ? (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name *</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>

              {/* Thêm field Avatar URL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Avatar URL</span>
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar || ''}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="https://example.com/avatar.jpg"
                />
                <div className="label-text-alt text-gray-500 mt-1">
                  Enter a valid image URL. If empty, default avatar will be used.
                </div>
                {/* Preview avatar nếu có URL */}
                {formData.avatar && (
                  <div className="mt-2">
                    <div className="label-text text-gray-700 mb-1">Preview:</div>
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                      <img 
                        src={formData.avatar} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Portrait_Placeholder.png';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">User Type</span>
                </label>
                <select
                  name="userType"
                  value={formData.userType || 'customer'}
                  onChange={handleChange}
                  className="select select-bordered"
                >
                  <option value="seller">Seller</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* <div className="form-control">
                <label className="label">
                  <span className="label-text">Password {!editData && '*'}</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder={editData ? "Leave blank to keep current" : ""}
                  required={!editData}
                />
              </div> */}

              <div className="form-control">
                <label className="cursor-pointer label justify-start gap-2">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified || false}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span className="label-text">Verified</span>
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Icon</span>
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon || ''}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="e.g., FaUser, FaHome"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Color</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="color"
                    value={formData.color || '#3b82f6'}
                    onChange={handleChange}
                    className="w-12 h-12"
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color || '#3b82f6'}
                    onChange={handleChange}
                    className="input input-bordered flex-1"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-20"
                />
              </div>

              <div className="form-control">
                <label className="cursor-pointer label justify-start gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive !== false}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span className="label-text">Active</span>
                </label>
              </div>
            </>
          )}

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={userMutation.isPending || categoryMutation.isPending}
            >
              {userMutation.isPending || categoryMutation.isPending
                ? 'Saving...'
                : editData ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddData;