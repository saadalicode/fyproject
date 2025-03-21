import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ButtonComponent from "../components/ButtonComponent";
import jsonData from "../data/patients";
import './PatientAppointmentDetails.css';

const PatientAppointmentDetails = () => {
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

    const handleReschedule = () => {
        alert("reschedule clicked");
        // navigate(`/patients/detail/reschedule/${appointment.appointment_id}`);
    }

    const handleCancel = () => {
        alert("cancel clicked");
        // navigate(`/patients/detail/cancel/${appointment.appointment_id}`);
    }

    return (
        <div className="patientAppointmentDetails-container">
            <h1>Patient Appointment Details</h1>

            <p><strong>Appointment Scheduler Name:</strong> {appointment.scheduler_name}</p>
            <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
            <p><strong>Patient Disease:</strong> {appointment.disease}</p>
            <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
            <p><strong>Appointment Status:</strong> {appointment.appointment_status}</p>
            {/* we will get the doctor name with doctor_id from doctor table in backend */}
            <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p> 

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

