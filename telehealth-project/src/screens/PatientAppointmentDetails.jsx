import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonComponent from "../components/ButtonComponent";
import jsonData from "../data/patients";
import './PatientAppointmentDetails.css';

const PatientAppointmentDetails = () => {
    const { id } = useParams();    // Get appointment id from url
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchAppointmentData();
    }, [id]);

    const fetchAppointmentData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/appointments/"+id,
              );
            //   console.log(" successful:", response.data);
              setAppointment(response.data);
        } catch (error) {
            console.error(" failed:", error.response?.data || error.message);
          }
    }

    if (!appointment) {
        return <h2 className="text-center text-red-600 text-2xl">Appointment not found</h2>;
    }

    const handleReschedule = () => {
        // alert("reschedule clicked");
        navigate(`/patients/detail/reschedule/${appointment.id}`);
    }

    const handleCancel = () => {
        alert("cancel");
        navigate(`/patients/detail/cancel/${appointment.id}`);
    }

    return (
        <div className="patientAppointmentDetails-container">
            <h1>Patient Appointment Details</h1>

            <p><strong>Appointment Scheduler Name:</strong> {appointment.patient.name}</p>
            <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
            <p><strong>Patient Father Name:</strong> {appointment.patient_father_name}</p>
            <p><strong>Patient Age:</strong> {appointment.patient_age}</p>
            <p><strong>Patient Disease:</strong> {appointment.disease}</p>
            <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
            <p><strong>Appointment Status:</strong> {appointment.appointment_status}</p>
            {/* we will get the doctor name with doctor_id from doctor table in backend */}
            <p><strong>Doctor Name:</strong> {appointment.doctor.name}</p> 

            <div>
                <p><strong>Doctor Remarks:</strong></p>
                {appointment.doctor_remarks ? (
                    <div className="patientAppointmentDetails-paragraph">
                        {appointment.doctor_remarks.split(".").map((sentence, index) => (
                            sentence.trim() && <p className="patientAppointmentDetails-remark" key={index}>{sentence.trim()}.</p>
                        ))}
                    </div>
                ) : (
                    <p className="patientAppointmentDetails-paragraph">No remarks available.</p>
                )}
            </div>

            {appointment.appointment_status === "pending" && (
                <>
                <ButtonComponent text="Reschedule" className="reschedule-button" onClick={handleReschedule} />
                <ButtonComponent text="Cancel" className="cancle-button" onClick={handleCancel}/>
                </>
            )}
        </div>
    );
};

export default PatientAppointmentDetails;

