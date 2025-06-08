// import React, {useState, useEffect} from "react";
// import axios from "axios";
// import DoctorCardInfo from '../components/DoctorCardInfo';
// import jsonData from '../data/doctors';

// const Doctors = () => {
//     const [doctorsData, setDoctorsData] = useState([]);

//     useEffect(() => {
//       //  axios.get(
//         //     "http://127.0.0.1:8000/api/doctors",
//         //   )
//         //   .then(response => {
//           //      console.log(" successful:", response.data);
//           // setDoctorsData(response.data); /* here we need to call doctors data from laravel-api */
//       //   })
//       //   .catch (error =>{
//       //       console.error(" failed:", error.response?.data || error.message);
//       //     }) 
//       fetchDoctorData();
//     },[]);

//     const fetchDoctorData = async () => {
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/api/doctors",
//         );
//         // console.log(" successful:", response.data);
//         setDoctorsData(response.data);
  
//       } catch (error) {
//         console.error(" failed:", error.response?.data || error.message);
//       }
//     };

//     return(
//         <div >
//           <h1 className="text-3xl font-bold mb-6 text-center">Meet Our Doctors</h1>
//           <div >
//             {doctorsData.map((doctor) => (
//               <DoctorCardInfo key={doctor.id} doctor={doctor} />
//             ))}
//           </div>
//       </div>
//     ); 
// }
// export default Doctors;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DoctorCardInfo from "../components/DoctorCardInfo";

const Doctors = () => {
  const [doctorsData, setDoctorsData] = useState([]);
  const location = useLocation();

  // Get search query from URL
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search")?.toLowerCase() || "";
  };

  const searchQuery = getSearchQuery();

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/doctors");
      setDoctorsData(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error.response?.data || error.message);
    }
  };

  // Filter only if a search term is provided
  const filteredDoctors = searchQuery
    ? doctorsData.filter((doctor) => {
        const specialization = doctor.specialization?.toLowerCase() || "";
        const location = doctor.location?.toLowerCase() || "";
        const name = doctor.name?.toLowerCase() || "";
        const available = doctor.available === 1;

        return (
          specialization.includes(searchQuery) ||
          location.includes(searchQuery) ||
          name.includes(searchQuery) ||
          (searchQuery === "available" && available) ||
          (searchQuery === "unavailable" && !available)
        );
      })
    : doctorsData;


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Meet Our Doctors</h1>
      <div>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCardInfo key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <p className="text-center text-gray-600">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;
