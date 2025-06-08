import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import "./Login.css"; // Import custom CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // to know the previous page

  const handleLogin = async () => {
      setErrorMessage(""); // Clear old error

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email,
          password,
        });

        const user = response.data.user;
        const role = response.data.role;

        // console.log("Login successful:", user);
        setSuccessMessage("Login successful.");
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", role); // Save role separately

        // Redirect to the previous page or home if none
        const from = location.state?.from || "/";
        navigate(from, { replace: true });

      } catch (error) {
        if (error.response) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
    };




  return (
    <div className="parent-container">
      <div className="child-container">

        {/* left side - Login Container */}
        <div className=" child login-container">

            {/* Login Heading */}
            <h2 className="login-title">Login</h2>

            {successMessage && <p className="success-message">{successMessage}</p>}

            {/* Email Input */}
            <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="custom-input"
            />

            {/* Password Input */}
            <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="custom-input"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}


            {/* Login Button */}
            <ButtonComponent
            text="Login"
            onClick={handleLogin}
            className="custom-button"
            />
        </div>
        {/* Right side - Sign up Message */}
        <div className="child signup-container">
            {/* Sign Up Link */}
            <p className="signup-text">
            Don't have an account?
            <Link to="/signup" className="signup-link">
                Sign Up
            </Link>
            </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
