import React, {useState, useEffect} from "react";
import DoctorCardInfo from '../components/DoctorCardInfo';
import jsonData from '../data/doctors';

const Doctors = () => {
    const [doctorsData, setDoctorsData] = useState([]);

    useEffect(() => {
        setDoctorsData(jsonData); /* here we need to call doctors data from laravel-api */
    },[]);

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