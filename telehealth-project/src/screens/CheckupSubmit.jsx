import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonComponent from "../components/ButtonComponent";
import jsonData from "../data/patients";
import './CheckupSubmit.css';

const CheckupSumbit = () => {
    const { id } = useParams();    // Get appointment id from url
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();

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

    const handleCheckupSumit = () => {
        navigate("/appointments");
    }

    const handleCheckupChange = () => {
        // alert("cancel clicked");
        navigate(`/appointments/detail/${id}`);
    }

    return (
        <div className="checkupSumbit-container">
            <h1>Patient Appointment Details</h1>

            <p><strong>Appointment Scheduler Name:</strong> {appointment.patient.name}</p>
            <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
            <p><strong>Patient Fahter Name:</strong> {appointment.patient_father_name}</p>
            <p><strong>Patient Age:</strong> {appointment.patient_age}</p>
            <p><strong>Patient Disease:</strong> {appointment.disease}</p>
            <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
            {/* we will get the doctor name with doctor_id from doctor table in backend */}
            <p><strong>Doctor Name:</strong> {appointment.doctor.name}</p> 

            <div>
                <p><strong>Doctor Remarks:</strong></p>
                {appointment.doctor_remarks ? (
                    <div className="checkupSumbit-paragraph">
                        {appointment.doctor_remarks.split(".").map((sentence, index) => (
                            sentence.trim() && <p className="checkupSumbit-remark" key={index}>{sentence.trim()}.</p>
                        ))}
                    </div>
                ) : (
                    <p className="checkupSumbit-paragraph">No remarks available.</p>
                )}
            </div>

            <>           
                <ButtonComponent text="No Change" className="checkup-submit-button" onClick={()=> handleCheckupSumit()} />
                <ButtonComponent text="Change" className="change-button" onClick={() => handleCheckupChange()}/>
            </>
            
        </div>
    );
};

export default CheckupSumbit;

