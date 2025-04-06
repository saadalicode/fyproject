import React from "react";
import { Link } from "react-router-dom";
import './DoctorCardInfo.css';

const DoctorCardInfo = ({ doctor }) => {
  return (
    <div className="container">
      {/* Doctor's Image */}
      <Link to={`/doctors/${doctor.id}`} className="cursor-pointer">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="images-container"
        />
      </Link>

       {/* Doctor's Details */}
       <div className="details-container">
        <Link to={`/doctors/${doctor.id}`}>
          {doctor.name}
        </Link>
        <p className="text-lg text-gray-600">{doctor.specialization}</p>
        <p className="text-gray-500">Experience: {doctor.experience} years</p>
        <p className="text-green-600 font-bold">Fee: {doctor.price}</p>
      </div>
    </div>
  );
};

export default DoctorCardInfo;
