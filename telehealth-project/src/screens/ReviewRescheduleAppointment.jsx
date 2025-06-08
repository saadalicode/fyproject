import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ButtonComponent from "../components/ButtonComponent";
import './BookAppointment.css';

const ReviewRescheduleAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        appointmentId,
        doctor,
        patient,
        selectedDay,
        selectedDate,
        remarks,
    } = location.state || {};

    if (!doctor || !patient) {
        return <h2 className="text-center text-red-600 text-2xl">Missing data. Please go back and try again.</h2>;
    }

    const userRole = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);

    const handleReschedule = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/appointments/reschedule/${appointmentId}`,
                {
                    selected_day: selectedDay,
                    selected_date: selectedDate,
                    doctor_id: doctor.id,
                    remarks: remarks,
                    performed_by: user.id,         // Assuming 'patient.id' is user ID
                    performed_by_role: userRole    // e.g., logged in usre role'patient' or 'admin'
                }
            );

            alert("Appointment rescheduled successfully!");

            // Navigate or show success message
            navigate("/appointments"); // Or any other page you want

        } catch (error) {
            console.error("Reschedule Error:", error.response?.data || error.message);
            alert("Failed to reschedule appointment: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="patientAppointmentDetails-container">
            <h1 className="text-2xl font-bold mb-4">Review Rescheduled Appointment</h1>

            <p><strong>Appointment Scheduler Name:</strong> {patient.name}</p>
            <p><strong>Doctor Name:</strong> {doctor.name}</p>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Experience:</strong> {doctor.experience} years</p>
            <p><strong>Fee:</strong> {doctor.price}</p>
            <p><strong>Opening Hours:</strong> {doctor.opening_hours}</p>
            <p><strong>Closing Hours:</strong> {doctor.closing_hours}</p>
            <p><strong>Appointment Day:</strong> {selectedDay}</p>
            <p><strong>New Appointment Date:</strong> {selectedDate}</p>
            <p><strong>Remarks:</strong> {remarks}</p>

            <ButtonComponent
                text="Confirm Reschedule"
                className="payment-button"
                onClick={handleReschedule}
            />
        </div>
    );
};

export default ReviewRescheduleAppointment;
