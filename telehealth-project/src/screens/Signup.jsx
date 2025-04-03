import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [patientField, setPatientField] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "", 
    image: "",
  });

  useEffect(() => {
    console.log(patientField);
  }, [patientField]);

  const handlePatientFieldChange = (e) => {
    const { name, value } = e.target;
    setPatientField((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/signup",
        patientField,
        { headers: { "Content-Type": "multipart/form-data", } }
      );
      console.log("Signup successful:", response.data);

      // Reset the form fields after successful submission
      setPatientField({  name: "",  phone: "",  email: "",  password: "",  address: "",  image: "",  });
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="parent-container">
      <div className="child-container">
        <div className="child llogin-container">
          <p className="llogin-text">Already Registered?</p>
          <p className="llogin-text">If you already have registered, then log in.</p>
          <Link to="/login" className="llogin-link">Log in</Link>
        </div>

        <div className="child ssignup-container">
          <h2 className="ssignup-title">Signup</h2>

          <InputField 
            type="text" placeholder="Name" name="name"
            value={patientField.name} onChange={handlePatientFieldChange}
            className="custom-input"
          />

          <InputField 
            type="tel" placeholder="Phone" name="phone"
            value={patientField.phone} onChange={handlePatientFieldChange} 
            className="custom-input"
          />

          <InputField 
            type="email" placeholder="Email" name="email"
            value={patientField.email} onChange={handlePatientFieldChange} 
            className="custom-input"
          />

          <InputField 
            type="password" placeholder="Password" name="password"
            value={patientField.password} onChange={handlePatientFieldChange} 
            className="custom-input"
          />

          <InputField 
            type="text" placeholder="Address" name="address"
            value={patientField.address} onChange={handlePatientFieldChange} 
            className="custom-input"
          />

          <div className="checkBox" onClick={handleCheckBoxChange}>
            <div className={isChecked ? "outer-checkBox checkedBox" : "outer-checkBox"}>
              <div className={isChecked ? "inner-checkBox" : ""}></div>
            </div>
            <label className="form-check-label" htmlFor="invalidCheck3">
              I Agree to <Link to={'/signup/terms&conditions'} className="termsAndConditions">terms and conditions</Link>.
            </label>
          </div>

          <ButtonComponent 
            text="Sign up" 
            onClick={(e) => handlePatientSubmit(e)}  
            className={`custom-button ${!isChecked ? "disabled" : ""}`}
            disabled={!isChecked}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
