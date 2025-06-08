import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import axios from "axios";
import "./DoctorRegister.css";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [addDoctorfield, setAddDoctorField] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    working_days: "",
    slots: "",
    opening_hours: "",
    closing_hours: "",
    price: "",
    address: "", 
    image: "",
    location: "",
  });

   const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file){
      setAddDoctorField((prevFields) => ({
        ...prevFields,
        image: file
      }));
    }
   };
  

    const handleAddDoctorFieldChange = (e) => {
        const { name, value } = e.target;

        if (name === "name") {
        const capitalized = value
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
        setAddDoctorField((prev) => ({ ...prev, [name]: capitalized }));
        } else {
            setAddDoctorField((prev) => ({ ...prev, [name]: value }));
        }
    };


  const formatTimeToHHMMSS = (time) => {
    return time ? time + ":00" : "";
  };
  
  const handleDoctorRegisterSubmit = async (e) => {
    e.preventDefault();

    // Prepare data
    const formData = new FormData();
    formData.append("name", addDoctorfield.name);
    formData.append("phone", addDoctorfield.phone);
    formData.append("email", addDoctorfield.email);
    formData.append("password", addDoctorfield.password);
    formData.append("specialization", addDoctorfield.specialization);
    formData.append("experience", addDoctorfield.experience);

    formData.append("working_days", JSON.stringify(addDoctorfield.working_days.split(",")));
    formData.append("slots", JSON.stringify(addDoctorfield.slots.split(",")));


    formData.append("opening_hours", formatTimeToHHMMSS(addDoctorfield.opening_hours));
    formData.append("closing_hours", formatTimeToHHMMSS(addDoctorfield.closing_hours));
    formData.append("price", addDoctorfield.price);
    formData.append("address", addDoctorfield.address);
    formData.append("image", addDoctorfield.image);
    formData.append("location", addDoctorfield.location);

    console.log(formData);

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/doctor/signup",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("New Doctor Created successfully:", response.data);
        // empty fields after successful creation
        setAddDoctorField({
            name: "", phone: "", email: "", password: "", specialization: "",
            experience: "", working_days: "", slots: "", opening_hours: "",
            closing_hours: "", price: "", address: "", image: "", location: "",
        });
        setSuccessMessage(response.data.message);

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


  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="register-parent-container">
      <div className="register-child-container">
        <div className="register-child ssignup-container">
          {/* {successMessage && <p className="success-message">{successMessage}</p>} */}
          
          <h2 className="ssignup-title">Doctor Signup</h2>

          {successMessage && <p className="success-msg">{successMessage}</p>}
          {error.general && <p className="error-message">{error.general}</p>}

          <InputField 
            type="text" 
            placeholder="Name" name="name"
            value={addDoctorfield.name} 
            onChange={handleAddDoctorFieldChange} 
          />
          {error.name && <span className="error-message">{error.name[0]}</span>}

          <InputField 
            type="tel" pattern="[0-9]{11}"   maxLength="11"
            placeholder="Phone" name="phone"
            value={addDoctorfield.phone} 
            onChange={handleAddDoctorFieldChange} 
          />
          {error.phone && <span className="error-message">{error.phone[0]}</span>}

          <InputField 
            type="email" 
            placeholder="Email" name="email"
            value={addDoctorfield.email} 
            onChange={handleAddDoctorFieldChange} 
          />
          {error.email && <span className="error-message">{error.email[0]}</span>}

          <InputField 
            type="password" 
            placeholder="Password" name="password"
            value={addDoctorfield.password} 
            onChange={handleAddDoctorFieldChange} 
          />
          {error.password && <span className="error-message">{error.password[0]}</span>}

          <InputField 
            type="text" 
            placeholder="Specialization" name="specialization"
            value={addDoctorfield.specialization} 
            onChange={handleAddDoctorFieldChange} 
          />
          
          <InputField 
            type="number" 
            placeholder="Experience" name="experience"
            value={addDoctorfield.experience} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="text" 
            placeholder="Working Days (e.g., Monday,Tuesday,Friday)" 
            name="working_days" 
            value={addDoctorfield.working_days} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="text" 
            placeholder="Slots per Day (e.g., 10,10,8)" 
            name="slots" 
            value={addDoctorfield.slots} 
            onChange={handleAddDoctorFieldChange} 
          />


          <InputField 
            type="time" 
            placeholder="Working Hours" name="opening_hours" 
            value={addDoctorfield.opening_hours} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="time" 
            placeholder="Closing Hours" name="closing_hours" 
            value={addDoctorfield.closing_hours} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="number" 
            placeholder="Fee" name="price" 
            value={addDoctorfield.price} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="text" 
            placeholder="Home Address" name="address"
            value={addDoctorfield.address} 
            onChange={handleAddDoctorFieldChange} 
          />
          {error.address && <span className="error-message">{error.address[0]}</span>}

          <InputField 
            type="text" 
            placeholder="Work Location" name="location"
            value={addDoctorfield.location} 
            onChange={handleAddDoctorFieldChange} 
          />

          <div className="addDoctor-image-container">
          <input 
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          </div>
          {addDoctorfield.image && (
            <div>
              <p>Preview:</p>
              <img 
                src={URL.createObjectURL(addDoctorfield.image)} 
                alt="Preview" 
                width="100"
              />
            </div>
          )}
          
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
            onClick={(e) => handleDoctorRegisterSubmit(e)}
            className={`custom-button ${!isChecked ? "disabled" : ""}`}
            disabled={!isChecked}
          />
        </div>

        <div className="register-child llogin-container">
          <p className="llogin-text">Already Registered?</p>
          <p className="llogin-text">If you already have registered, then log in.</p>
          <Link to="/login" className="llogin-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
