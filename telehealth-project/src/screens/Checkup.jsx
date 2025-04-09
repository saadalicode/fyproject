import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import jsonData from "../data/appointments";
import './Checkup.css';

const Checkup = () => {
    const { id } = useParams(); // Get appointment ID from URL
    const [appointment, setAppointment] = useState(null);
    const [preAppointment, setPreAppointment] = useState([]);
    const [patientField, setPatientField] = useState({
        "appointment_status": "entertained",
        "patient_name": "",
        "patient_father_name": "",
        "patient_age": "",
        "disease": "",
        "doctor_remarks": "",
    })
    const [patientName, setPatientName] = useState("");
    const [patientFatherName, setPatientFatherName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [doctorRemark, setDoctorRemark] = useState("");
    const [visibleRemarks, setVisibleRemarks] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        // const appointmentData = jsonData.find((patient) => patient.appointment_id === parseInt(id));
        // if (appointmentData) {
        //     setAppointment(appointmentData);
        //     setPatientName(appointmentData.scheduler_name);
        // }
        fetchAppointmentData();

    }, [id]);

    const fetchAppointmentData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/appointments/"+id,
              );
            //   console.log(" successful:", response.data);
              setAppointment(response.data);

            // Set patient_name from backend to input field
            setPatientField((prev) => ({
                ...prev,
                patient_name: response.data.patient.name,   // *@@#@#$*** Store schedular name same as patient while booking ******---###@
                patient_father_name: response.data.patient_father_name,
                patient_age: response.data.patient_age,
                disease: response.data.disease,
                doctor_remarks: response.data.doctor_remarks,
            }));
        } catch (error) {
            console.error(" failed:", error.response?.data || error.message);
          }
    }

    useEffect( () => {
        if (patientField.patient_name) {
           fetchPreviousAppointmentData(); 
        } else {
            setPreAppointment([]); // Reset when no patient name is entered
        }
    }, [patientField.patient_name]); // Dependency on patientName
    
    const fetchPreviousAppointmentData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/appointment/detail",
                {
                    params: {
                        patient_name: patientField.patient_name, // send patient name as query param
                    },
                }
            );
            // console.log("Previous appointments fetched:", response.data);
            setPreAppointment(response.data); // Set actual data
        } catch (error) {
            console.error("Failed to fetch previous appointments:", error.response?.data || error.message);
            setPreAppointment([]); // fallback
        }
    };
    

    const handlePatientFieldChange = (e) => {
        const { name, value } = e.target;
        setPatientField((prevFields) => ({
          ...prevFields,
          [name]: value
        }));
      };

    const handleCheckupClick = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/appointments/${id}/status`, patientField
               
            );
            // console.log("Previous appointments fetched:", response.data);
            navigate(`/appointments/detail/finalize/${id}`); // Redirect to the checkupSubmit page
        } catch (error) {
            console.error("Failed to fetch previous appointments:", error.response?.data || error.message);
        }
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
                ${appointment.patient.name}`}</p>
                <p className="text-lg text-gray-600">{`Appointment Date: ${appointment.appointment_date}`}</p>

                {/* Verify the patient name. If the patient name is different than registered appointment patient name, then it will store in verified_name and also take the age on patient presence  */}
                <label className="checkup-label" htmlFor="patientName">Actual Patient Name:</label>
                <InputField 
                    type="text" 
                    placeholder="Patient Name"
                    name="patient_name" 
                    value={patientField.patient_name} 
                    onChange={handlePatientFieldChange} 
                />

                <label className="checkup-label" htmlFor="patientFatherName">Patient Father Name:</label>
                <InputField 
                    type="text" 
                    placeholder="Patient Fahter Name" name="patient_father_name"
                    value={patientField.patient_father_name} 
                    onChange={handlePatientFieldChange} 
                />

                <label className="checkup-label" htmlFor="patientAge">Patient Age:</label>
                <InputField 
                    type="number" 
                    placeholder="0" name="patient_age"
                    value={patientField.patient_age} 
                    onChange={handlePatientFieldChange} 
                />

                <label className="checkup-label" htmlFor="patientAge">Patient Disease:</label>
                <InputField 
                    type="text" 
                    placeholder="Patient Disease" name="disease"
                    value={patientField.disease} 
                    onChange={handlePatientFieldChange} 
                />

                <label className="checkup-label">
                    Doctor Remarks:

                    <textarea 
                        placeholder="Remarks..." name="doctor_remarks"
                        value={patientField.doctor_remarks} 
                        onChange={handlePatientFieldChange} 
                        rows={4} 
                        className="doctor-remarks" 
                    />
                </label>


                {/*  checkup Button */}
                <ButtonComponent onClick={(e) => handleCheckupClick(e)} text="Submit" className="checkup-button" />

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
                        <React.Fragment key={appoint.id}>
                            
                            <tr className="previous-record-row" >
                                <td>{appoint.patient_name}</td>
                                <td>{appoint.doctor.name}</td>
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
