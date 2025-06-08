import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [patientField, setPatientField] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    image: "", 
  });

  const handlePatientFieldChange = (e) => {
    const { name, value } = e.target;

   
    if (name === "name") {
      const capitalized = value
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      setPatientField((prev) => ({ ...prev, [name]: capitalized }));
    } else {
      setPatientField((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/signup", patientField, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Signup successful. Redirecting to login...");
      setError({});
      setPatientField({ name: "", phone: "", email: "", password: "", address: "", image: "" });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Laravel validation errors
        setError(error.response.data.error);
        setSuccessMessage("");
      } else {
        setError({ general: "Something went wrong. Please try again." });
        setSuccessMessage("");
      }
    }
  };

  return (
    <div className="parent-container">
      <div className="child-container">
        <div className="child llogin-container">
          <p className="llogin-text">Already Registered?</p>
          <p className="llogin-text">If you already have registered, then log in.</p>
          <Link to="/login" className="llogin-link">Log in</Link>
          <div className="doctor-register-box">
            <p className="doctor-register-text llogin-text"><Link to="/doctor/signup" className="llogin-link">Sign up</Link> as a Doctor</p>
          </div>
        </div>

        <div className="child ssignup-container">
          {/* {successMessage && <p className="success-message">{successMessage}</p>} */}
          
          <h2 className="ssignup-title">Signup</h2>

          {successMessage && <p className="success-msg">{successMessage}</p>}
          {error.general && <p className="error-message">{error.general}</p>}

          <InputField
            type="text" placeholder="Name" name="name"
            value={patientField.name} onChange={handlePatientFieldChange}
            className="custom-input"
          />
          {error.name && <span className="error-message">{error.name[0]}</span>}

          <InputField
            type="tel" placeholder="Phone" name="phone"
            value={patientField.phone} onChange={handlePatientFieldChange}
            className="custom-input"
          />
          {error.phone && <span className="error-message">{error.phone[0]}</span>}

          <InputField
            type="email" placeholder="Email" name="email"
            value={patientField.email} onChange={handlePatientFieldChange}
            className="custom-input"
          />
          {error.email && <span className="error-message">{error.email[0]}</span>}

          <InputField
            type="password" placeholder="Password" name="password"
            value={patientField.password} onChange={handlePatientFieldChange}
            className="custom-input"
          />
          {error.password && <span className="error-message">{error.password[0]}</span>}

          <InputField
            type="text" placeholder="Address" name="address"
            value={patientField.address} onChange={handlePatientFieldChange}
            className="custom-input"
          />
          {error.address && <span className="error-message">{error.address[0]}</span>}

          {/* <InputField
            type="file" placeholder="Upload Image" name="image"
            onChange={handlePatientFieldChange}
            className="custom-input"
          />
          {error.image && <span className="error-msg">{error.image[0]}</span>} */}

          <div className="checkBox" onClick={handleCheckBoxChange}>
            <div className={isChecked ? "outer-checkBox checkedBox" : "outer-checkBox"}>
              <div className={isChecked ? "inner-checkBox" : ""}></div>
            </div>
            <label className="form-check-label">
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
