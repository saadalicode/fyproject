import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import "./Signup.css";

const Signup = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [Name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="parent-container">
      {/* Child Container */}
      <div className="child-container">

        {/* Left Side - Login Message */}
        <div className="child llogin-container">
          <p className="llogin-text">Already Registered?</p>
          <p className="llogin-text">If you already have registered, then log in.</p>
          <Link to="/login" className="llogin-link">
            Log in
          </Link>
        </div>
        
        {/* Right Side - Signup Form */}
        <div className="child ssignup-container">
          <h2 className="ssignup-title">Signup</h2>
          
          <InputField 
            type="Name" 
            placeholder="Name" 
            value={Name} 
            onChange={(e) => setName(e.target.value)} 
            className="custom-input"
          />

          <InputField 
            type="Phone" 
            placeholder="Phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="custom-input"
          />

          <InputField 
            type="Email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="custom-input"
          />

          <InputField 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="custom-input"
          />

          <InputField 
            type="address" 
            placeholder="Address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className="custom-input"
          />

          <div className="checkBox" onClick={handleChange}>
            <div className={isChecked ? "outer-checkBox checkedBox" : "outer-checkBox" }>
              <div className={isChecked ? "inner-checkBox" : "" }></div>
            </div>
              <label class="form-check-label" for="invalidCheck3">
                I Agree to <Link to={'/signup/terms&conditions'} className="termsAndConditions">terms and conditions
                </Link>.
              </label>
              <div id="invalidCheck3Feedback" class="invalid-feedback">
                You must agree before submitting.
              </div>
          </div>


          <ButtonComponent 
            text="Sign up" 
            onClick={() => alert("Signup logic here")}  className={`custom-button ${!isChecked ? "disabled" : ""}`}
            disable={!isChecked}
          />

        </div>


      </div>
    </div>
  );
};

export default Signup;
