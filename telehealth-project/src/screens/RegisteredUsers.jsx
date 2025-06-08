import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../components/ButtonComponent";
import './RegisteredUsers.css';

const RegisteredUsers = () => {
    const navigate = useNavigate();
    
    const handlePatientButton =  () => { 
        navigate('/dashboard/users/patients');
    };
    const handleDoctorButton =  () => { 
        navigate('/dashboard/users/doctors');
    };
    const handleAdminButton =  () => { 

    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Registered Users</h1>
            <div className="registered-users-container">

            <ButtonComponent
                text="Patients"
                className="registered-user-button patient-list-button"
                onClick={handlePatientButton}
            />

            <ButtonComponent
                text="Doctors"
                className="registered-user-button doctor-list-button"
                onClick={handleDoctorButton}
            />

            <ButtonComponent
                text="Admin"
                className="registered-user-button admin-list-button"
                onClick={handleAdminButton}
            />
            </div>
        </div>
    );
};

export default RegisteredUsers;
