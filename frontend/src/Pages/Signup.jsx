import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { toast } from "react-toastify";




const Signup = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        setError("");

        try {
            setLoading(true);
            await api.post("/users/register", formData);
            toast.success("Signup successful! Please login.");
            navigate("/login");

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Signup failed"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#212121] px-4">
            {/* Card */}
            <div className="w-full max-w-md bg-[#2a2a2a] p-6 sm:p-8 rounded-lg shadow-md">

                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Username */}
                    <div>
                        <label className="block text-sm mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            className="w-full px-4 py-2 rounded-md bg-[#212121] border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full px-4 py-2 rounded-md bg-[#212121] border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm mb-1">Password</label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full px-4 py-2 pr-12 rounded-md bg-[#212121] border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
                                required
                            />

                            {/* Eye icon */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                            >
                                {showPassword ? <GoEyeClosed className="text-black" /> : <GoEye className="text-black" />}
                            </button>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-gray-950 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-md font-semibold transition cursor-pointer"
                    >
                        {loading ? "Creating..." : "Signup"}
                    </button>

                </form>
                <p className="text-center text-sm text-gray-400 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-white hover:text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup