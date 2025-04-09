import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsonData from "../data/patients";
import './Profile.css';

const Profile = () => {
    const { id } = useParams();    // Get patient id from url
    const [userData, setUserData] = useState(null);

    useEffect(() => {
       fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/users/"+id,);
              console.log(" successful:", response.data);
              setUserData(response.data);
        } catch (error) {
            console.error(" failed:", error.response?.data || error.message);
          }
    }

    if (!userData) {
        return <h2 className="text-center text-red-600 text-2xl">User not found</h2>;
    }


    return (
        <div className="profile-container">
            <h1>User Account Information</h1>
            <img
                    src={userData.user.image}
                    alt={`${userData.user.name} Image`}
                    className="profile-image"
                    />
            <p><strong>User Name:</strong> {userData.user.name}</p>
            <p><strong>User Phone:</strong> {userData.user.phone}</p>
            <p><strong>User email:</strong> {userData.user.email}</p>
            <p><strong>User Address:</strong> {userData.user.address}</p>

        </div>
    );
};

export default Profile;

