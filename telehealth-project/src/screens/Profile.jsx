import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsonData from "../data/patients";
import './Profile.css';

const Profile = () => {
    const { id } = useParams();    // Get patient id from url
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const appointmentData = jsonData.find(
            (patient) => patient.appointment_id === parseInt(id)
        );
        if (appointmentData) {
            setAppointment(appointmentData);
        }
    }, [id]);

    if (!appointment) {
        return <h2 className="text-center text-red-600 text-2xl">Appointment not found</h2>;
    }

    return (
        <div className="profile-container">
            <h1>Profile Information</h1>

            <p><strong>Appointment Scheduler Name:</strong> {appointment.scheduler_name}</p>
            <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
            <p><strong>Patient Disease:</strong> {appointment.disease}</p>
            <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
            <p><strong>Appointment Status:</strong> {appointment.appointment_status}</p>
            {/* we will get the doctor name with doctor_id from doctor table in backend */}
            <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p> 

        </div>
    );
};

export default Profile;

