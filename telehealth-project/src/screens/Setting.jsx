import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsonData from "../data/patients";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import './Setting.css';

const Setting = () => {
    const { id } = useParams();    // Get patient id from url
    const [userData, setUserData] = useState(null);
    const [updateUserData, setUpdateUserData] = useState({
        "name": '',
        "phone": '',
        "email": '',
        "password": '',
        "address": '',
        "image": '',
    });

    useEffect(() => {
       fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/users/"+id,);
              console.log(" successful:", response.data);
              setUserData(response.data);

              setUpdateUserData((prev) => ({
                ...prev,
                name: response.data.user.name,
                phone: response.data.user.phone,
                email: response.data.user.email,
                address: response.data.user.address,
            }));
        } catch (error) {
            console.error(" failed:", error.response?.data || error.message);
          }
    }

    if (!userData) {
        return <h2 className="text-center text-red-600 text-2xl">User not found</h2>;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file){
          setUpdateUserData((prevFields) => ({
            ...prevFields,
            image: file
          }));
        }
      };
      
    
      const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        setUpdateUserData((prevFields) => ({
          ...prevFields,
          [name]: value
        }));
      };


    return (
        <>
          <div className="profile-container">
          <h1 >Update User Information</h1>

          <InputField 
            type="text" placeholder="Name" name="name"
            value={userData.user.name} onChange={handleUserDataChange}
            className="custom-input"
          />

          <InputField 
            type="tel" placeholder="Phone" name="phone"
            value={userData.user.phone} onChange={handleUserDataChange} 
            className="custom-input"
          />

            <InputField 
                type="email" placeholder="Email" name="email"
                value={userData.user.email} onChange={handleUserDataChange} 
                className="custom-input"
            />

          <InputField 
            type="text" placeholder="Address" name="address"
            value={userData.user.address} onChange={handleUserDataChange} 
            className="custom-input"
          />

          <div className="addDoctor-image-container">
          <input 
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          </div>
          {updateUserData.image && (
            <div>
              <p>Preview:</p>
              <img 
                src={URL.createObjectURL(updateUserData.image)} 
                alt="Preview" 
                width="100"
              />
            </div>
          )}

          <ButtonComponent 
            text="Save" 
            onClick={() => alert("clicked")}  
            className={`custom-button`}
          />
          
        </div>
        
        <div className="profile-container">
          <InputField 
            type="password" placeholder="Previous Password" name="password"
            value={userData.user.password} onChange={handleUserDataChange} 
            className="custom-input"
          />
          <InputField 
            type="password" placeholder="New Password" name="new_password"
            value={userData.user.password} onChange={handleUserDataChange} 
            className="custom-input"
          />
          <InputField 
            type="password" placeholder="Confirm Password" name="confirm_password"
            value={userData.user.password} onChange={handleUserDataChange} 
            className="custom-input"
          />
            
          <ButtonComponent 
            text="Reset Password" 
            onClick={() => alert("clicked")}  
            className={`custom-button`}
          />
        </div>
        </>
    );
};

export default Setting;

