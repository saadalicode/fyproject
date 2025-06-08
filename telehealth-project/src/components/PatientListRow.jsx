import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./PatientListRow.css";

const PatientListRow = ({ patient, classname }) => {
    const navigate = useNavigate();

    const handleCheckupClick = () => {
      navigate(`/appointments/detail/${patient.id}`);
    }

  return (
    <tr className={classname}>
      <td>{patient.patient.name}</td>
      <td>{patient.appointment_date}</td>
      <td>{patient.appointment_status}</td>
      <td>
        <ButtonComponent className="patient-button" text="Checkup" onClick={handleCheckupClick} />
      </td>
    </tr>
  );
};

export default PatientListRow;
