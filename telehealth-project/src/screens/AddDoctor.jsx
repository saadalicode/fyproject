import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import "./AddDoctor.css";

const AddDoctor = () => {
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
    setAddDoctorField((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  const formatTimeToHHMMSS = (time) => {
    return time ? time + ":00" : "";
  };
  
  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();

    // Prepare data
    const formData = new FormData();
    formData.append("name", addDoctorfield.name);
    formData.append("phone", addDoctorfield.phone);
    formData.append("email", addDoctorfield.email);
    formData.append("password", addDoctorfield.password);
    formData.append("specialization", addDoctorfield.specialization);
    formData.append("experience", addDoctorfield.experience);

    formData.append("working_days", JSON.stringify(addDoctorfield.working_days.split(" ")));
    formData.append("slots", JSON.stringify(addDoctorfield.slots.split(" ")));

    formData.append("opening_hours", formatTimeToHHMMSS(addDoctorfield.opening_hours));
    formData.append("closing_hours", formatTimeToHHMMSS(addDoctorfield.closing_hours));
    formData.append("price", addDoctorfield.price);
    formData.append("address", addDoctorfield.address);
    formData.append("image", addDoctorfield.image);

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/addDoctor",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("New Doctor Created successfully:", response.data);
        setAddDoctorField({
            name: "", phone: "", email: "", password: "", specialization: "",
            experience: "", working_days: "", slots: "", opening_hours: "",
            closing_hours: "", price: "", address: "", image: ""
        });
    } catch (error) {
        console.error("New Doctor Creation failed:", error.response?.data || error.message);
    }
};
  

  return (
    <div className="addDoctor-container">
        
          <h2 className="my-4">Add a New Doctor</h2>
          
          <InputField 
            type="text" 
            placeholder="Name" name="name"
            value={addDoctorfield.name} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="tel"    maxLength="11"
            placeholder="Phone" name="phone"
            value={addDoctorfield.phone} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="email" 
            placeholder="Email" name="email"
            value={addDoctorfield.email} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="password" 
            placeholder="Password" name="password"
            value={addDoctorfield.password} 
            onChange={handleAddDoctorFieldChange} 
          />

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
            placeholder="Working Days (e.g., Monday Tuesday Friday)" name="working_days" 
            value={addDoctorfield.working_days} 
            onChange={handleAddDoctorFieldChange} 
          />

          <InputField 
            type="number" 
            placeholder="Slots per Day (e.g., 10 10 8)" name="slots" 
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
            placeholder="Address" name="address"
            value={addDoctorfield.address} 
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

          <ButtonComponent text="Submit" onClick={(e) => handleAddDoctorSubmit(e)}  className='addDoctor-button'/>

    </div>
  );
};

export default AddDoctor;
