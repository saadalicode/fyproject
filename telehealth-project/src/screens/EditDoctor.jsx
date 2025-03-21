import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import "./EditDoctor.css";
import jsonData from "../data/doctors.json";

const EditDoctor = () => {
  const [Name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  const { id } = useParams(); // Get doctor ID from URL
    const [doctor, setDoctor] = useState(null);
    const [doctors, setDoctors] = useState(null);

  useEffect(() => {
          setDoctors(jsonData);
  }, []);

  useEffect(() => {
      const doctorData = jsonData.find((doc) => doc.id === parseInt(id));
      if (doctorData) {
          setDoctor(doctorData);
      }
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);  
  };

  const handleSubmit = () => {
    const updatedDoctor = { ...doctor, Name, email, phone, specialization, address, image };
    setDoctors(doctors.map(d => (d.id === doctor.id ? updatedDoctor : d)));
    navigate("/");
  };

  return (
    <div className="editDoctor-container">
        
        <h2 className="my-4">Edit Doctor</h2>
        { doctor ? (
          <>
            <InputField 
              type="Name" 
              placeholder="Name"
              value={Name || doctor.name} 
              onChange={(e) => setName(e.target.value)} 
            />

            <InputField 
              type="Phone" 
              placeholder="Phone" 
              value={phone || doctor.phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />

            <InputField 
              type="Email" 
              placeholder="Email" 
              value={email || doctor.email} 
              onChange={(e) => setEmail(e.target.value)} 
            />

            {/* <InputField 
              type="password" 
              placeholder={doctor.password} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            /> */}

            <InputField 
              type="specialization" 
              placeholder="Specialization" 
              value={specialization || doctor.specialization} 
              onChange={(e) => setSpecialization(e.target.value)} 
            />

            <InputField 
              type="address" 
              placeholder="Address" 
              value={address || doctor.address} 
              onChange={(e) => setAddress(e.target.value)} 
            />

            <div className="editDoctor-image-container">
              <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
              />
            </div>
          </>
            ): (
              <p>Loading doctor data...</p>
            ) 
        }

          <ButtonComponent text="Submit" onClick={() => alert("Add New Doctor logic here")}  className='editDoctor-button'/>

    </div>
  );
};

export default EditDoctor;
