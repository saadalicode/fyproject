import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import axios from "axios";
import "./ReviewRegisterRequest.css";

const ReviewRegisterRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [image, setImage] = useState(null);

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/doctors/edit/${id}`);
      setDoctor(response.data);
      // console.log(response.data.image);
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

  const handleAcceptRegisterRequestSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in doctor) {
        formData.append(key, doctor[key]);
      }
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(`http://127.0.0.1:8000/api/doctors/registration/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
      navigate("/doctors");
    } catch (error) {
      console.error("Creation error:", error.response?.data || error.message);
      setErrorMsg("Failed to register doctor. Please check your input and try again.");
    }
  };

  const handleDeclineRegisterRequestSubmit = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/doctors/delete/${id}`);
      alert(response.data.message);
      navigate("/doctors");
    } catch (error){
      const errorMsg = error.response?.data?.message || "Failed to delete doctor. Try again.";
      setErrorMsg(errorMsg);
    }

  };

  if (loading) return <p>Loading doctor data...</p>;

  return (
    <div className="editDoctor-container">
      <h2 className="my-4">Review Add Doctor Request Data</h2>
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
      <div className="button-container">
        <ButtonComponent text="Accept" onClick={handleAcceptRegisterRequestSubmit} className="accept-register-request-button" />
        <ButtonComponent text="Decline" onClick={handleDeclineRegisterRequestSubmit} className="decline-register-request-button" />
      </div>
    </div>
  );
};

export default ReviewRegisterRequest;
