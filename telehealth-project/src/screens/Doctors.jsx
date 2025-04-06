import React, {useState, useEffect} from "react";
import axios from "axios";
import DoctorCardInfo from '../components/DoctorCardInfo';
import jsonData from '../data/doctors';

const Doctors = () => {
    const [doctorsData, setDoctorsData] = useState([]);

    useEffect(() => {
      //  axios.get(
        //     "http://127.0.0.1:8000/api/doctors",
        //   )
        //   .then(response => {
          //      console.log(" successful:", response.data);
          // setDoctorsData(response.data); /* here we need to call doctors data from laravel-api */
      //   })
      //   .catch (error =>{
      //       console.error(" failed:", error.response?.data || error.message);
      //     }) 
      fetchDoctorData();
    },[]);

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/doctors",
        );
        // console.log(" successful:", response.data);
        setDoctorsData(response.data);
  
      } catch (error) {
        console.error(" failed:", error.response?.data || error.message);
      }
    };

    return(
        <div >
          <h1 className="text-3xl font-bold mb-6 text-center">Meet Our Doctors</h1>
          <div >
            {doctorsData.map((doctor) => (
              <DoctorCardInfo key={doctor.id} doctor={doctor} />
            ))}
          </div>
      </div>
    ); 
}
export default Doctors;