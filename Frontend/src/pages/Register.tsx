import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

interface FormData {
    name: string;
    password: string;
    email: string;
    otp: string;
}

interface GoogleCredentialResponse {
    credential?: string;
}

const Signup = () => {
    const [form, setForm] = useState<FormData>({
        name: '',
        password: '',
        email: '',
        otp: '',
    });
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleGetOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Basic validation
            if (!form.name || !form.email || !form.password) {
                throw new Error('All fields are required');
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                throw new Error('Please enter a valid email address');
            }

            if (form.password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            await axios.post(`${API_BASE}/auth/register`, {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            setOtpSent(true);
            setShowOtp(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Registration failed. Please try again.');
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!form.otp) {
                throw new Error('OTP is required');
            }

            await axios.post(`${API_BASE}/auth/verify-otp`, {
                email: form.email,
                otp: form.otp,
            });

            // Redirect to login with success message
            navigate('/login', { state: { success: 'Registration successful! Please login.' } });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'OTP verification failed. Please try again.');
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: GoogleCredentialResponse) => {
        setLoading(true);
        setError('');

        try {
            if (!credentialResponse.credential) {
                throw new Error('Google authentication failed');
            }

            // You can decode the token to get user info if needed
            const decoded = jwtDecode(credentialResponse.credential);
            console.log('Google user info:', decoded);

            // Send the credential to your backend
            const response = await axios.post(`${API_BASE}/auth/google`, {
                token: credentialResponse.credential
            });

            // Handle successful login (store token, redirect, etc.)
            localStorage.setItem('token', response.data.token);
            navigate('/'); // Or wherever you want to redirect after login
            window.location.reload();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Google login failed. Please try again.');
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred during Google login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                {/* Left Side - Form */}
                <div className="p-8 md:p-12">
                    <div className="flex items-center gap-2 mb-6">
                        <img
                            src="/icon.png"
                            alt="Icon Logo"
                            className="w-6 h-6"
                        />
                        <span className="text-lg font-semibold text-gray-800">HD</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Sign up</h2>
                    <p className="text-gray-500 mb-6">Sign up to enjoy the feature of HD</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={otpSent ? handleVerifyOtp : handleGetOtp}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="sr-only">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={otpSent}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={otpSent}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={otpSent}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {showOtp && (
                                <div>
                                    <label htmlFor="otp" className="sr-only">OTP</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            placeholder="Enter OTP"
                                            value={form.otp}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            inputMode="numeric"
                                            pattern="\d*"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Check your email for the OTP code
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-wait flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {otpSent ? 'Sign up' : 'Get OTP'}
                            </button>
                        </div>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                            text="signup_with"
                            shape="rectangular"
                            size="large"
                            width="100%"
                        />

                        {loading && (
                            <div className="text-center">
                                <svg className="animate-spin h-5 w-5 text-blue-600 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Right Side - Image */}
                <div className="hidden md:block bg-blue-50">
                    <div className="h-full flex items-center justify-center p-8">
                        <img
                            src="/right-column.png"
                            alt="Signup Visual"
                            className="object-contain w-full h-full max-h-[600px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;