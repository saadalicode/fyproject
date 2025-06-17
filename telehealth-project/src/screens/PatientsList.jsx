import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PatientListRow from "../components/PatientListRow";
import './DoctorList.css';

const PatientsList = () => {
  const navigate = useNavigate();
  const [patientsData, setPatientsData] = useState([]);
  const [message, setMessage] = useState(""); // New state for backend message

  const fetchPatientsData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/patients");
      
      if (Array.isArray(response.data)) {
        setPatientsData(response.data);
        setMessage("");
      } else {
        setPatientsData([]);
        setMessage("No Patient found.");
      }
      // console.log(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error fetching patients.";
      setMessage(errorMsg);
      setPatientsData([]);
    }
  };

  useEffect(() => {
    fetchPatientsData();
  }, []);

  return (
    <div className="doctorList-container">
      {message ? (
        <p style={{ textAlign: "center", color: "gray", fontSize: "18px" }}>{message}</p>
      ) : (
        <table border="0" className="doctorList-table">
          <thead className="doctorList-thead">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patientsData.map((patient) => (
              <PatientListRow
                key={patient.id}
                patient={patient}
                classname="doctorList-tr"
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientsList;
