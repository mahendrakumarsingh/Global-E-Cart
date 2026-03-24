import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Login Successful');
            if (data.isAdmin) navigate('/admin');
            else navigate(redirect);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            <div className="flex w-full max-w-4xl h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl">
                {/* Left Side - Image */}
                <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center relative">
                    <div className="absolute inset-0 bg-blue-900/20 z-10"></div>
                    <img src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2089&auto=format&fit=crop" className="absolute inset-0 h-full w-full object-cover" alt="" />
                    <div className="relative z-20 p-8 text-white">
                        <div className="size-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Your gateway to global savings.</h1>
                        <p className="text-base text-blue-100">Access curated deals from top e-commerce platforms like Amazon, Flipkart, and Myntra in one place.</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
                        <p className="text-gray-500 mb-6 text-sm">Please enter your details to sign in</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold mb-1">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">mail</span>
                                    <input
                                        type="email"
                                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-semibold">Password</label>
                                    <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">lock</span>
                                    <input
                                        type="password"
                                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="keep-logged-in" className="w-3 h-3 text-primary border-gray-300 rounded focus:ring-primary" />
                                <label htmlFor="keep-logged-in" className="ml-2 text-xs text-gray-600">Keep me logged in</label>
                            </div>

                            <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-sm">
                                Sign In
                            </button>
                        </form>

                        <div className="mt-6 relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <span className="relative bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or social login</span>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-600 text-sm">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                                Google
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-600 text-sm">
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" alt="Facebook" />
                                Facebook
                            </button>
                        </div>

                        <p className="mt-6 text-center text-xs text-gray-500">
                            Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
