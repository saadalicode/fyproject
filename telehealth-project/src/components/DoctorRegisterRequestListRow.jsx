import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./DoctorRegisterRequestListRow.css";

const DoctorRegisterRequestListRow = ({ doctor, classname }) => {
    const navigate = useNavigate();

    const handleReviewRegisterRquestClick = () => {
      navigate(`/dashboard/request/review/${doctor.id}`);
    }


  return (
    <tr className={classname}>
      <td>{doctor.id}</td>
      <td>{doctor.name}</td>
      <td>{doctor.email}</td>
      <td>{doctor.specialization}</td>
      <td>
        <img src={doctor.image} alt={`${doctor.name} Image`} style={{ width: "40px", height: "40px" }} />
      </td>
      <td>
        <ButtonComponent className="review-register-request-button" text="Review" onClick={handleReviewRegisterRquestClick} />
      </td>
    </tr>
  );
};

export default DoctorRegisterRequestListRow;
