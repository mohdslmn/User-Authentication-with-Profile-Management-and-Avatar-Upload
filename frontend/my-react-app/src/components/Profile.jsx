import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../constant/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', avatar: null });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userId = localStorage.getItem('userId');
           

            if (userId) {
                try {
                    const profileUrl = `${backendUrl}${import.meta.env.VITE_PROFILE_USER_ROUTE}/${userId}`;
                    const response = await axios.get(profileUrl);
                    // const avatarUrl = `${backendUrl}/${response.data.avatar}`;
                    // console.log('Response Data:', response.data);
                    setUser(response.data);
                    setUpdatedUser({ name: response.data.name, email: response.data.email, avatar: response.data.avatar });
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setError('Failed to fetch user profile.');
                }
            } else {
                setError('No user ID found. Please log in.');
            }
        };

        fetchUserProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({ ...updatedUser, [name]: value });
    };

    const handleFileChange = (e) => {
        setUpdatedUser({ ...updatedUser, avatar: e.target.files[0] });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        const data = new FormData();
        data.append('name', updatedUser.name);
        data.append('email', updatedUser.email);
        if (updatedUser.avatar) {
            data.append('avatar', updatedUser.avatar);
        }

        try {
            const updateUrl = `${backendUrl}${import.meta.env.VITE_UPDATE_PROFILE_ROUTE}/${userId}`;

            console.log('Update URL:', updateUrl);
            const response = await axios.put(updateUrl, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUser(response.data);
            console.log('Profile updated successfully:', response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
            setError('Failed to update user profile.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-all duration-500 hover:scale-105">
                <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {user ? (
                    isEditing ? (
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <img
                                    src={user.avatar ? `${backendUrl}/${user.avatar}` : './pic.png'}
                                    alt="User Avatar"
                                    className="w-24 h-24 rounded-full  mb-4"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedUser.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={updatedUser.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full mb-4"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition duration-300"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                className="w-full bg-gray-300 text-black p-2 rounded mt-2"
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <img
                                src={user.avatar ? `${backendUrl}/${user.avatar}` : '/path/to/default-avatar.png'}
                                alt="User Avatar"
                                className="w-24 h-24 rounded-full mx-auto mb-4"
                            />
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <button
                                onClick={handleEditToggle}
                                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition duration-300 mt-4"
                            >
                                Edit
                            </button>
                        </div>
                    )
                ) : (
                    <p className="text-center">Loading user data...</p>
                )}
                <div className="text-center mt-4">
                    <a href="/login" className="text-blue-600 hover:underline">Logout</a>
                </div>
            </div>
        </div>
    );
};

export default Profile;