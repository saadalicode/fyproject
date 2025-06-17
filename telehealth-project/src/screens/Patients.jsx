import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientAppointmentListRow from "../components/PatientAppointmentListRow";
import jsonData from "../data/appointments.json";
import "./Patients.css";

const Patients = () => {
    const [patientsData, setPatientsData] = useState([]);

    useEffect(()=>{
        // const pendingAppointments = jsonData.filter(appointment => appointment.appointment_status === "pending");
        // setAppointmentsData(pendingAppointments);
        fetchpatientData();
    },[]);

    const fetchpatientData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/patients/appointments",
              );
            //   console.log(" successful:", response.data);
              setPatientsData(response.data);
        } catch (error) {
            console.error(" failed:", error.response?.data || error.message);
          }
    }

    return (
        <div className="patientsList-container">
            <table border="0" className="patientsList-table">
                <thead className="patientsList-thead">
                <tr>
                    <th>Scheduler Name</th>
                    <th>Appointment Date</th>
                    <th>Appointment Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {patientsData.map((patient) => (
                    <PatientAppointmentListRow 
                        key={patient.id} 
                        appointment={patient} 
                        classname="patientsList-row"
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Patients;