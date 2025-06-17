import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import axios from "axios";
import "./EditPatient.css";

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [image, setImage] = useState(null);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/edit/${id}`);
      setPatient(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMsg("Failed to fetch Patient data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      // Compare fields and add only changed ones
    if (patient.name) formData.append("name", patient.name);
    if (patient.phone) formData.append("phone", patient.phone);
    if (patient.email) formData.append("email", patient.email);
    if (patient.password) formData.append("password", patient.password);
    if (patient.address) formData.append("address", patient.address);

      // Add image if user selected a new one
    if (image) {
      formData.append("image", image);
    }

      await axios.post(`http://127.0.0.1:8000/api/patients/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Patient updated successfully.");
      navigate("/");
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      setErrorMsg("Failed to update patient. Please check your input and try again.");
    }
  };

  if (loading) return <p>Loading patient data...</p>;

  return (
    <div className="editPatient-container">
      <h2 className="my-4">Edit Patient</h2>
      {errorMsg && <p className="error">{errorMsg}</p>}

      <InputField
        type="text"
        placeholder="Name"
        name="name"
        value={patient.name || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="tel"
        maxLength="11"
        placeholder="Phone"
        name="phone"
        value={patient.phone || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="email"
        placeholder="Email"
        name="email"
        value={patient.email || ""}
        onChange={handleInputChange}
      />

      <InputField
        type="password"
        placeholder="New Password"
        name="password"
        value={patient.password || ""}
        onChange={handleInputChange}
      />


      <InputField
        type="text"
        placeholder="Home Address"
        name="address"
        value={patient.address || ""}
        onChange={handleInputChange}
      />


      <div className="editPatient-image-container">
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
        {!image && patient.image && (
          <div>
            <p>Current Image:</p>
            <img
                src={patient.image} alt={`${patient.name} Image`} width="100"
            />
          </div>
        )}
      </div>

      <ButtonComponent text="Update" onClick={handleSubmit} className="editPatient-button" />
    </div>
  );
};

export default EditPatient;
