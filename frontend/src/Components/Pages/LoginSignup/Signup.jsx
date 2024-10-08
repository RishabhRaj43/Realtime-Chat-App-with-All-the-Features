import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import useProfile from "../../../Zustand/useProfile";
import "../../Ui/Checkbox.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
    gender: "",
    phoneNumber: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const { userId, login } = useProfile();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return; // Prevent form submission
    }
    if (Object.values(formData).some((field) => !field)) {
      return toast.error("All fields are required");
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/user/signup",
        formData,
        { withCredentials: true }
      );
      login(res.data.token);
      toast.success("User Created");
      setFormData({
        username: "",
        email: "",
        password: "",
        gender: "",
        displayName: "",
        phoneNumber: "",
      });
      navigate("/");
    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  return (
    <div className="w-full h-screen bg-white top-0 items-center justify-center">
      <div className="bg-gray-100 w-1/2 flex items-center justify-center">
        <div className="w-full p-6 flex flex-col justify-center">
          <h1 className="text-6xl font-semibold mb-6 text-black text-center">
            Sign Up
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username.trim()}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email.trim()}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password.trim()}
                  onChange={handleChange}
                  className="p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center focus:outline-none"
                >
                  <img
                    className="w-5 h-5"
                    src={
                      isPasswordVisible
                        ? "https://cdn-icons-png.flaticon.com/512/30/30890.png"
                        : "https://cdn-icons-png.flaticon.com/512/31/31607.png"
                    }
                    alt="Toggle visibility"
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword.trim()}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    formData.password === confirmPassword
                      ? "focus:ring-green-700"
                      : "focus:ring-red-700"
                  } focus:ring-opacity-50 transition-colors duration-300 pr-10`}
                />
                <div
                  className={`text-red-500 text-xs mt-2 transition-opacity duration-300 ease-in-out ${
                    formData.password === confirmPassword
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                >
                  Passwords do not match!!
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber.trim()}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>

            <div className="flex items-center">
              <h1 className="pr-3 ">Male</h1>
              <div className="content">
                <label className="container">
                  <input
                    type="checkbox"
                    name="gender"
                    value={"male"}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: "Male" })
                    }
                    checked={formData.gender === "Male" ? true : false}
                  />
                  <svg viewBox="0 0 64 64" height="1.5em" width="1.5em">
                    <path
                      d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                      pathLength="575.0541381835938"
                      className="path"
                    ></path>
                  </svg>
                </label>
              </div>
              {/*Female */}
              <h1 className="px-3 ">Female</h1>
              <div className="content">
                <label className="container">
                  <input
                    type="checkbox"
                    name="gender"
                    value={"female"}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: "Female" })
                    }
                    checked={formData.gender === "Female" ? true : false}
                  />
                  <svg viewBox="0 0 64 64" height="1.5em" width="1.5em">
                    <path
                      d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                      pathLength="575.0541381835938"
                      className="path"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-[#000000] hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
