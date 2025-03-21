import React, { useEffect, useState } from "react";
import PatientListRow from "../components/PatientListRow";
import jsonData from "../data/patients.json";
import "./Patients.css";

const Patients = () => {
    const [patientsData, setPatientsData] = useState([]);

    useEffect(()=>{
        setPatientsData(jsonData);
    },[]);

    return (
        <div className="patientsList-container">
            <table border="0" className="patientsList-table">
                <thead className="patientsList-thead">
                <tr>
                    <th>Scheduler Name</th>
                    <th>Patient Name</th>
                    <th>Appointment Date</th>
                    <th>Appointment Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {patientsData.map((patient) => (
                    <PatientListRow 
                        key={patient.appointment_id} 
                        patient={patient} 
                        classname="patientsList-row"
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Patients;