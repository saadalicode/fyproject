import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorRegisterRequestListRow from "../components/DoctorRegisterRequestListRow";
import axios from "axios";
import './DoctorList.css';

const AllDoctors = () => {
  const navigate = useNavigate();
  const [doctorsData, setDoctorsData] = useState([]);
  const [message, setMessage] = useState(""); // New state for backend message

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/doctors");
      
      if (Array.isArray(response.data)) {
        setDoctorsData(response.data);
        setMessage("");
      } else {
        setDoctorsData([]);
        setMessage("No Doctor found.");
      }

      // console.log(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error fetching doctors.";
      setMessage(errorMsg);
      setDoctorsData([]);
      // console.error("Error fetching doctors:", errorMsg);
    }
  };

  useEffect(() => {
    fetchDoctorData();
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
              <th>Specialization</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctorsData.map((doctor) => (
              <DoctorRegisterRequestListRow
                key={doctor.id}
                doctor={doctor}
                classname="doctorList-tr"
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllDoctors;
