import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import "./Login.css"; // Import custom CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="parent-container">
      <div className="child-container">

        {/* left side - Login Container */}
        <div className=" child login-container">

            {/* Login Heading */}
            <h2 className="login-title">Login</h2>

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

            {/* Login Button */}
            <ButtonComponent
            text="Login"
            onClick={() => alert("Login logic here")}
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
