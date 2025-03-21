import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./DoctorListRow.css";

const DoctorListRow = ({ doctor, onDelete, classname }) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
      navigate(`/dashboard/doctors/edit/${doctor.id}`);
    }

    const handleDeleteClick = () => {
      alert("Delete Button got clicked.");
      // onDelete(doctor.id)
    }

  return (
    <tr className={classname}>
      <td>{doctor.id}</td>
      <td>{doctor.name}</td>
      <td>{doctor.email}</td>
      <td>{doctor.specialization}</td>
      <td>
        <img src={`/assets/images/doctors/${doctor.image}`}  alt="doctor" style={{ width: "40px", height: "40px" }} />
      </td>
      <td>
        <ButtonComponent className="edit-button" text="Edit" onClick={handleEditClick} />
        <ButtonComponent className="delete-button" text={"Delete"} onClick={handleDeleteClick} />
      </td>
    </tr>
  );
};

export default DoctorListRow;
