import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonComponent from "../components/ButtonComponent";
import './BookAppointment.css';

const BookAppointment = () => {
    const { id, day, date } = useParams(); // Get doctor ID and selected day
    const [doctor, setDoctor] = useState(null);
    const [patient, setPatient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorData();
        getLoggedInUser();
    }, [id]);

    const fetchDoctorData = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/doctors/"+id,
          );
          setDoctor(response.data);
          
        } catch (error) {
          console.error("failed:", error.response?.data || error.message);
        }
      };

    const getLoggedInUser = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setPatient(user);
        } else {
            navigate("/login"); // redirect if user not logged in
        }
    };

    
    const handlePayment = () => {
        navigate("/pay", {
            state: {
            doctor,
            patient,
            appointmentDate: date,       
            amount: doctor.price 
            }
        });    
    };


    if (!doctor || !patient) return <h2 className="text-center text-red-600 text-2xl">Loading...</h2>;

    return (
        <div className="patientAppointmentDetails-container">
            <h1 className="text-2xl font-bold mb-4">Appointment Details</h1>

            <p><strong>Appointment Scheduler Name:</strong> {patient.name}</p>
            <p><strong>Doctor Name:</strong> {doctor.name}</p>
            <p><strong>Doctor Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Doctor Experience:</strong> {doctor.experience} years</p>
            <p><strong>Fee:</strong> {doctor.price}</p>
            <p><strong>Opening Hours:</strong> {doctor.opening_hours}</p>
            <p><strong>Closing Hours:</strong> {doctor.closing_hours}</p>
            <p><strong>Appointment Day:</strong> {day}</p>
            <p><strong>Appointment Date:</strong> {date}</p>

            <ButtonComponent
                text="Payment"
                className="payment-button"
                onClick={handlePayment}
            />
        </div>
    );
};

export default BookAppointment;

