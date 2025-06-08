import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./AppointmentListRow.css";

const AppointmentListRow = ({ appointment, classname }) => {
    const navigate = useNavigate();

    const handleAppointmentDetials = () => {
      navigate(`/patients/detail/${appointment.id}`);
    }

  return (
    <tr className={classname}>
      <td>{appointment.patient.name}</td>
      <td>{appointment.patient_name}</td>
      <td>{appointment.appointment_date}</td>
      <td>{appointment.appointment_status}</td>
      <td>
        <ButtonComponent className="appointment-details-button" text="Details" onClick={handleAppointmentDetials} />
      </td>
    </tr>
  );
};

export default AppointmentListRow;

