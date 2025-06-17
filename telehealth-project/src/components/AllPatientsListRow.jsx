import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./AllPatientListRow.css";

const AllPatientListRow = ({ patient, classname }) => {
    const navigate = useNavigate();

    const handleReviewRegisterRquestClick = () => {
      navigate(`/dashboard/request/review/${patient.id}`);
    }


  return (
    <tr className={classname}>
      <td>{patient.id}</td>
      <td>{patient.name}</td>
      <td>{patient.email}</td>
      <td>{patient.phone}</td>
      <td>
        <img src={patient.image} alt={`${patient.name} Image`} style={{ width: "40px", height: "40px" }} />
      </td>
      <td>
        <ButtonComponent className="review-register-request-button" text="Review" onClick={handleReviewRegisterRquestClick} />
      </td>
    </tr>
  );
};

export default AllPatientListRow;
