import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "./PatientListRow.css";

const PatientListRow = ({ patient, classname }) => {
    const navigate = useNavigate();
      const [errorMsg, setErrorMsg] = useState("");
    

    const handleEditClick = () => {
      navigate(`/dashboard/patients/edit/${patient.id}`);
    }

    const handleDeleteClick = async () => {
      // alert("Delete Button got clicked.");
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/patients/delete/${patient.id}`);
        alert(response.data.message);
      } catch (error){
        const errorMsg = error.response?.data?.message || "Failed to delete doctor. Try again.";
        setErrorMsg(errorMsg);
      }
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
        <ButtonComponent className="edit-button" text="Edit" onClick={handleEditClick} />
        <ButtonComponent className="delete-button" text="Delete" onClick={handleDeleteClick} />
      </td>
    </tr>
  );
};

export default PatientListRow;
