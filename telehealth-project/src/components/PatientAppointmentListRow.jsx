import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./PatientAppointmentListRow.css";

const PatientAppointmentListRow = ({ appointment, classname }) => {
    const navigate = useNavigate();

    const handleCheckupClick = () => {
      navigate(`/appointments/detail/${appointment.id}`);
    }

    const handleDetailsClick = () => {
      navigate(`/patients/detail/${appointment.id}`);
    }

  return (
    <tr className={classname}>
      <td>{appointment.patient.name}</td>
      <td>{appointment.appointment_date}</td>
      <td>{appointment.appointment_status}</td>
      <td>
        <ButtonComponent className="patient-button" text="Checkup" onClick={handleCheckupClick} />
        <ButtonComponent className="details-button" text="Details" onClick={handleDetailsClick} />
      </td>
    </tr>
  );
};

export default PatientAppointmentListRow;
