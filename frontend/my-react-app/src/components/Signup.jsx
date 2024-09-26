
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../constant/api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: null,
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, avatar: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('avatar', formData.avatar);

        try {
            const signupUrl = `${backendUrl}${import.meta.env.VITE_SIGNIN_USER_ROUTE}`;

            const response = await axios.post(signupUrl, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            setSuccessMessage('Sign-up successful! Redirecting to login...');

            // Navigate to login immediately
            navigate('/login');
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-all duration-500 hover:scale-105 animate-slide-down">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="w-full mb-4"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;