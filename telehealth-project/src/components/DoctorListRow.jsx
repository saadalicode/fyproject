import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonComponent from "./ButtonComponent";
import "./DoctorListRow.css";

const DoctorListRow = ({ doctor, classname }) => {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    

    const handleEditClick = () => {
      navigate(`/dashboard/doctors/edit/${doctor.id}`);
    }

    const handleDeleteClick = async () => {
        try {
        const response = await axios.get(`http://127.0.0.1:8000/api/doctors/delete/${doctor.id}`);
        alert(response.data.message);
        navigate("/doctors");
      } catch (error){
        const errorMsg = error.response?.data?.message || "Failed to delete doctor. Try again.";
        setErrorMsg(errorMsg);
      }
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
        <ButtonComponent className="edit-button" text="Edit" onClick={handleEditClick} />
        <ButtonComponent className="delete-button" text={"Delete"} onClick={handleDeleteClick} />
      </td>
    </tr>
  );
};

export default DoctorListRow;
