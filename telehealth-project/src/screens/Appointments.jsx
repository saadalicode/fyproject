import React, { useEffect, useState } from "react";
import AppointmentListRow from "../components/AppointmentListRow";
import jsonData from "../data/appointments.json";
import "./Appointments.css";

const Appointments = () => {
    const [appointmentsData, setAppointmentsData] = useState([]);

    useEffect(()=>{
        const pendingAppointments = jsonData.filter(appointment => appointment.appointment_status === "pending");
        setAppointmentsData(pendingAppointments);
    },[]);

    return (
        <div className="appointmentsList-container">
            <table border="0" className="appointmentsList-table">
                <thead className="appointmentsList-thead">
                <tr>
                    <th>Scheduler Name</th>
                    <th>Appointment Date</th>
                    <th>Appointment Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {appointmentsData.map((appointment) => (
                    <AppointmentListRow 
                        key={appointment.appointment_id} 
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