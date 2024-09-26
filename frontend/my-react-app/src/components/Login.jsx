
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../constant/api'; 
import {jwtDecode} from 'jwt-decode';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

 
    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const loginUrl = `${backendUrl}${import.meta.env.VITE_LOGIN_USER_ROUTE}`; 
            const response = await axios.post(loginUrl, credentials);
            console.log('Login Response:', response.data);
 
            // Assuming the response contains the user ID and token
            const decodedToken = jwtDecode(response.data); 
            const userId = decodedToken.id; 
 
            // Clear existing user data
            localStorage.clear();
 
            // // Set new user data in localStorage
            localStorage.setItem('userId', userId);
            // localStorage.setItem('token', token);
 
            navigate('/profile');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-all duration-500 hover:scale-105 animate-slide-down">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don&apos;t have an account?{' '}
                    <a href="/signup" className="text-green-600 hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;