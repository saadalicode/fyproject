import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./PatientListRow.css";

const PatientListRow = ({ patient, classname }) => {
    const navigate = useNavigate();

    const handlePatientDetials = () => {
      navigate(`/patients/detail/${patient.id}`);
    }

  return (
    <tr className={classname}>
      <td>{patient.patient.name}</td>
      <td>{patient.patient_name}</td>
      <td>{patient.appointment_date}</td>
      <td>{patient.appointment_status}</td>
      <td>
        <ButtonComponent className="patient-details-button" text="Details" onClick={handlePatientDetials} />
      </td>
    </tr>
  );
};

export default PatientListRow;
