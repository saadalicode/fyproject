import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientListRow from "../components/PatientListRow";
import jsonData from "../data/patients.json";
import "./Patients.css";

const Patients = () => {
    const [patientsData, setPatientsData] = useState([]); // later change it for only the login patient 

    useEffect(()=>{
        // setPatientsData(jsonData);
        fetchPatientsData();
    },[]);

    const fetchPatientsData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/appointments",
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
                    <th>Patient Name</th>
                    <th>Appointment Date</th>
                    <th>Appointment Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {patientsData.map((patient) => (
                    <PatientListRow 
                        key={patient.id} 
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