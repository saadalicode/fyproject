import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsonData from "../data/patients";
import './Profile.css';

const Profile = () => {
    const { id } = useParams();    // Get patient id from url
    const [userData, setUserData] = useState(null);

    useEffect(() => {
       getLoggedInUserData();
    }, [id]);

    const getLoggedInUserData = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserData(user);
            console.log(user);
        } else {
            navigate("/login"); // redirect if user not logged in
        }
    };
    

    if (!userData) {
        return <h2 className="text-center text-red-600 text-2xl">User not found</h2>;
    }


    return (
        <div className="profile-container">
            <h1>User Account Information</h1>
            <img
                    src={userData.image}
                    alt={`${userData.name} Image`}
                    className="profile-image"
                    />
            <p><strong>User Name:</strong> {userData.name}</p>
            <p><strong>User Phone:</strong> {userData.phone}</p>
            <p><strong>User email:</strong> {userData.email}</p>
            <p><strong>User Address:</strong> {userData.address}</p>

        </div>
    );
};

export default Profile;

