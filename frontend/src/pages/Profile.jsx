import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
    const { user } = useContext(ShopContext);

    if (!user) {
        return <div>Đang tải thông tin...</div>;
    }

    return (
        <div className="container mx-auto my-10 p-5 bg-white shadow rounded">
            <h1 className="text-2xl font-semibold mb-5">Hồ sơ của tôi</h1>
            <div className="flex flex-col gap-4">
                <p><strong>Tên:</strong> {user.name || 'Chưa cập nhật'}</p>
                <p><strong>Email:</strong> {user.email || 'Chưa cập nhật'}</p>
                <p><strong>Số điện thoại:</strong> {user.phone || 'Chưa cập nhật'}</p>
                <p><strong>Địa chỉ:</strong> {user.address || 'Chưa cập nhật'}</p>
            </div>
        </div>
    );
};

export default Profile;
