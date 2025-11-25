// import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAUser } from '../api/ApiCollection';
import AddData from '../components/AddData';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchAUser(id || ''),
    enabled: !!id,
  });

  const handleClose = () => {
    navigate('/users');
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      <AddData
        slug="user"
        isOpen={true}
        setIsOpen={handleClose}
        editData={userData}
      />
    </div>
  );
};

export default UserEdit;