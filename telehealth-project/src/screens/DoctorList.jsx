import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import DoctorListRow from "../components/DoctorListRow";
import axios from "axios";
import jsonData from "../data/doctors";
import './DoctorList.css';


const DoctorList = () => {
  const navigate = useNavigate();
  const [doctorsData, setDoctorsData] = useState([]);

  
  const fetchDoctorData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/doctors");
      setDoctorsData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);
  
  const handleOnDelete = (id) => {
    // setDoctorsData(doctorsData.filter((doctor) => doctor.id !== id));
    alert('Doctor with id:${id} got clicked for deletion.');
  }

  return (
    <div className="doctorList-container">
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
        {doctorsData?.map((doctor) => (
              <DoctorListRow 
                key={doctor.id} 
                doctor={doctor} 
                onDelete={handleOnDelete} 
                classname="doctorList-tr"
                />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorList;
