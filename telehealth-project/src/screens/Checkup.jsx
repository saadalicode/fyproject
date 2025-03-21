import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import jsonData from "../data/appointments";
import './Checkup.css';

const Checkup = () => {
    const { id } = useParams(); // Get appointment ID from URL
    const [appointment, setAppointment] = useState(null);
    const [patientName, setPatientName] = useState("");
    const [patientFatherName, setPatientFatherName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [doctorRemark, setDoctorRemark] = useState("");
    const [preAppointment, setPreAppointment] = useState([]);
    const [visibleRemarks, setVisibleRemarks] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        const appointmentData = jsonData.find((patient) => patient.appointment_id === parseInt(id));
        if (appointmentData) {
            setAppointment(appointmentData);
            setPatientName(appointmentData.scheduler_name);
        }
    }, [id]);

    useEffect(() => {
        if (patientName) {
            const previousAppointments = jsonData.filter(
                (patient) =>
                    patient.patient_name.toLowerCase() === patientName.toLowerCase() &&
                    patient.appointment_status === "entertained"
            );
            setPreAppointment(previousAppointments); // Store previous entertained records
        } else {
            setPreAppointment([]); // Reset when no patient name is entered
        }
    }, [patientName]); // Dependency on patientName

    const handleAppointmentClick = () => {
        navigate("/appointments"); // Redirect to the appointments page
    };

    const toggleRemarkVisibility = (appointmentId) => {
        setVisibleRemarks((prev) => ({
            ...prev,
            [appointmentId]: !prev[appointmentId],
        }));
    };


    if (!appointment) {
        return <h2 className="text-center text-red-600 text-2xl">Appointment not found</h2>;
    }

    return (
        <>
        <div className="checkup-container">
            <div className="checkup-details-container">
                <h1>Checkup Form</h1>
                <p className="text-lg text-gray-600">{`Appointment Scheduler Name: 
                ${appointment.scheduler_name}`}</p>
                <p className="text-lg text-gray-600">{`Appointment Date: ${appointment.appointment_date}`}</p>

                {/* Verify the patient name. If the patient name is different than registered appointment patient name, then it will store in verified_name and also take the age on patient presence  */}
                <label className="checkup-label" htmlFor="patientName">Actual Patient Name:</label>
                <InputField 
                    type="text" 
                    placeholder="Patient Name" 
                    value={patientName} 
                    onChange={(e) => setPatientName(e.target.value)} 
                />

                <label className="checkup-label" htmlFor="patientFatherName">Patient Father Name:</label>
                <InputField 
                    type="text" 
                    placeholder="Patient Fahter Name" 
                    value={patientFatherName} 
                    onChange={(e) => setPatientName(e.target.value)} 
                />

                <label className="checkup-label" htmlFor="patientAge">Patient Age:</label>
                <InputField 
                    type="number" 
                    placeholder="0" 
                    value={patientAge} 
                    onChange={(e) => setPatientAge(e.target.value)} 
                />

                <label className="checkup-label">
                    Doctor Remarks:

                    <textarea 
                        value={doctorRemark} 
                        placeholder="Remarks..." 
                        onChange={(e) => setDoctorRemark(e.target.value)} 
                        rows={4} 
                        className="doctor-remarks" 
                    />
                </label>


                {/*  checkup Button */}
                <ButtonComponent onClick={handleAppointmentClick} text="Submit" className="checkup-button" />

            </div>
        </div>

         {/* Display Previous Records */}
         <div className="previous-record-container">
            <h2>Previous Patient Record</h2>
            {preAppointment.length > 0 ? (
                <table border="0" className="previous-record-table">
                    <thead className="previous-record-thead">
                    <tr>
                        <th>Patient Name</th>   
                        <th>Doctor Name</th>
                        <th>Disease</th>
                        <th>Appointment Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {preAppointment.map((appoint) => (
                        <React.Fragment key={appoint.appointment_id}>
                            
                            <tr className="previous-record-row" >
                                <td>{appoint.patient_name}</td>
                                <td>{appoint.doctor_name}</td>
                                <td>{appoint.disease}</td>
                                <td>{appoint.appointment_date}</td>
                            </tr>
    
                            {/* Remark Header with Dropdown Button */}
                            <tr className="remark-header-row">
                                <td colSpan="1" className="remark-header">
                                    <button
                                        className="remark-button"
                                        onClick={() => toggleRemarkVisibility(appoint.appointment_id)}
                                    >
                                        {visibleRemarks[appoint.appointment_id] ? "Hide Remark" : "Show Remark"}
                                    </button>
                                </td>
                            </tr>
    
                            {/* Remark Row (Visible when clicked) */}
                            {visibleRemarks[appoint.appointment_id] && (
                                <tr className="remark-row">
                                    <td colSpan="4" className="remark-text">
                                        {appoint.doctor_remarks ? (
                                            appoint.doctor_remarks.split(".").map((sentence, index) => (
                                                sentence.trim() && <div key={index}>{sentence.trim()}.</div>
                                            ))
                                        ) : (
                                            <div>No remarks available.</div>
                                        )}
                                    </td>
                                    {/* <td>
                                        {appoint.doctor_remarks || }
                                    </td> */}
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            ) : (
                <h5 className="text-center text-gray-600 text-lg">No previous records found.</h5>
            )}
        </div>
        </>
    );
};

export default Checkup;
