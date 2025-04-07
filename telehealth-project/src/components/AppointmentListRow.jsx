import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./AppointmentListRow.css";

const AppointmentListRow = ({ appointment, classname }) => {
    const navigate = useNavigate();

    const handleCheckupClick = () => {
      navigate(`/appointments/detail/${appointment.id}`);
    }

  return (
    <tr className={classname}>
      <td>{appointment.patient.name}</td>
      <td>{appointment.appointment_date}</td>
      <td>{appointment.appointment_status}</td>
      <td>
        <ButtonComponent className="appointment-button" text="Checkup" onClick={handleCheckupClick} />
      </td>
    </tr>
  );
};

export default AppointmentListRow;
