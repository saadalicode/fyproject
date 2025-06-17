import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import axios from "axios";
import "./EditDoctor.css";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [image, setImage] = useState(null);

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/doctors/edit/${id}`);
      const doctorData = response.data;
      // Convert arrays to comma-separated strings for display
      if (Array.isArray(doctorData.working_days)) {
        doctorData.working_days = doctorData.working_days.join(',');
      }
      if (Array.isArray(doctorData.slots)) {
        doctorData.slots = doctorData.slots.join(',');
      }
      setDoctor(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMsg("Failed to fetch doctor data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
  try {
    const formData = new FormData();

    // Compare fields and add only changed ones
    if (doctor.name) formData.append("name", doctor.name);
    if (doctor.phone) formData.append("phone", doctor.phone);
    if (doctor.email) formData.append("email", doctor.email);
    if (doctor.password) formData.append("password", doctor.password);
    if (doctor.specialization) formData.append("specialization", doctor.specialization);
    if (doctor.experience !== undefined && doctor.experience !== null)
      formData.append("experience", doctor.experience);
    if (doctor.opening_hours) formData.append("opening_hours", doctor.opening_hours);
    if (doctor.closing_hours) formData.append("closing_hours", doctor.closing_hours);
    if (doctor.price !== undefined && doctor.price !== null) formData.append("price", doctor.price);
    if (doctor.address) formData.append("address", doctor.address);
    if (doctor.location) formData.append("location", doctor.location);

    // Only add working_days if not empty or null
    if (doctor.working_days && doctor.working_days.trim() !== "") {
      const workingDaysArray = doctor.working_days.split(",").map(day => day.trim());
      formData.append("working_days", JSON.stringify(workingDaysArray));
    }

    // Only add slots if not empty or null
    if (doctor.slots && doctor.slots.trim() !== "") {
      const slotsArray = doctor.slots.split(",").map(slot => slot.trim());
      formData.append("slots", JSON.stringify(slotsArray));
    }

    // Add image if user selected a new one
    if (image) {
      formData.append("image", image);
    }

    await axios.post(`http://127.0.0.1:8000/api/doctors/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Doctor updated successfully.");
    navigate("/");
  } catch (error) {
    console.error("Update error:", error.response?.data || error.message);
    setErrorMsg("Failed to update doctor. Please check your input and try again.");
  }
};



  if (loading) return <p>Loading doctor data...</p>;

  return (
    <div className="editDoctor-container">
      <h2 className="my-4">Edit Doctor</h2>
      {errorMsg && <p className="error">{errorMsg}</p>}

      <InputField
        type="text"
        placeholder="Name"
        name="name"
        value={doctor.name || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="tel"
        maxLength="11"
        placeholder="Phone"
        name="phone"
        value={doctor.phone || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="email"
        placeholder="Email"
        name="email"
        value={doctor.email || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="password"
        placeholder="New Password"
        name="password"
        value={doctor.password || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="text"
        placeholder="Specialization"
        name="specialization"
        value={doctor.specialization || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="number"
        placeholder="Experience"
        name="experience"
        value={doctor.experience || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="text"
        placeholder="Working Days (e.g., Monday,Tuesday,Friday)"
        name="working_days"
        value={doctor.working_days || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="text"
        placeholder="Slots per Day (e.g., 10,10,8)"
        name="slots"
        value={doctor.slots || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="time"
        placeholder="Opening Hours"
        name="opening_hours"
        value={doctor.opening_hours || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="time"
        placeholder="Closing Hours"
        name="closing_hours"
        value={doctor.closing_hours || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="number"
        placeholder="Fee"
        name="price"
        value={doctor.price || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="text"
        placeholder="Home Address"
        name="address"
        value={doctor.address || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="text"
        placeholder="Work Location"
        name="location"
        value={doctor.location || ""}
        onChange={handleInputChange}
      />

      <div className="editDoctor-image-container">
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {image && (
          <div>
            <p>New Preview:</p>
            <img src={URL.createObjectURL(image)} alt="Preview" width="100" />
          </div>
        )}
        {!image && doctor.image && (
          <div>
            <p>Current Image:</p>
            <img
                src={doctor.image} alt={`${doctor.name} Image`} width="100"
            />
          </div>
        )}
      </div>

      <ButtonComponent text="Update" onClick={handleSubmit} className="editDoctor-button" />
    </div>
  );
};

export default EditDoctor;
