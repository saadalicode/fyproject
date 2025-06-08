import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentListRow from "../components/AppointmentListRow";
import jsonData from "../data/patients.json";
import "./Appointments.css";

const Appointments = () => {
    const [appointmentsData, setAppointmentsData] = useState([]); // later change it for only the login patient 

    useEffect(()=>{
        // setPatientsData(jsonData);
        fetchAppointmentsData();
    },[]);

    const fetchAppointmentsData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/appointments",
              );
            //   console.log(" successful:", response.data);
              setAppointmentsData(response.data);
        } catch (error) {
            console.error(" failed:", error.response?.data || error.message);
          }
    }

    return (
        <div className="appointmentsList-container">
            <table border="0" className="appointmentsList-table">
                <thead className="appointmentsList-thead">
                <tr>
                    <th>Scheduler Name</th>
                    <th>Patient Name</th>
                    <th>Appointment Date</th>
                    <th>Appointment Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {appointmentsData.map((appointment) => (
                    <AppointmentListRow 
                        key={appointment.id} 
                        appointment={appointment} 
                        classname="appointmentsList-row"
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Appointments;