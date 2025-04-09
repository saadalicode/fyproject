import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsonData from "../data/doctors";
import './DoctorDetails.css';

const DoctorDetail = () => {
    const { id } = useParams(); // Get doctor ID from URL
    const [doctor, setDoctor] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");

    useEffect(() => {
        // const doctorData = jsonData.find((doc) => doc.id === parseInt(id));
        // if (doctorData) {
        //     setDoctor(doctorData);
        // }
        fetchDoctorData();
    }, [id]);

    const fetchDoctorData = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/doctors/"+id,
          );
          // console.log(" successful:", response.data);
          setDoctor(response.data);
          const data = response.data;

    // Parse the double-encoded strings
    const workingDaysString = JSON.parse(data.working_days); // "Wednesday Friday Sunday"
    const slotsString = JSON.parse(data.slots);              // "8 10 10"

    const working_days = workingDaysString.split(" ");
    const slots = slotsString.split(" ").map(Number); // convert to array of numbers

    setDoctor({
      ...data,
      working_days,
      slots,
    });
    
        } catch (error) {
          console.error(" failed:", error.response?.data || error.message);
        }
      };

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login"); // Redirect to the login page
    };

    
    if (!doctor) {
        return <h2 className="text-center text-red-600 text-2xl">Doctor not found</h2>;
    }
    // console.log(selectedDay);

    return (
        <div className="doctorDetails-container">
             <img
                src={doctor.image}
                alt={`${doctor.name} Image`}
                className="doctorDetails-image-container"
            />
            <div className="doctorDetails-details-container">
                <h1 className="text-3xl font-bold text-gray-800 mt-4">{doctor.name}</h1>
                <p className="text-lg text-gray-600">{doctor.specialization}</p>
                <p className="text-gray-500">Experience: {doctor.experience} years</p>
                <p className="text-green-600 font-bold">Fee: {doctor.price}</p>
                {/* <p className="text-gray-500">Available Slots: {doctor.slots}</p> */}
                <p className="text-gray-500">Opening Hours: {doctor.opening_hours}</p>
                <p className="text-gray-500">Closing Hours: {doctor.closing_hours}</p>

                {/* Available Days  */}
                {doctor.working_days && doctor.working_days.length > 0 ? (
                  <div className="mt-4">
                    <label className="text-gray-700 font-semibold">Select a day:</label>
                    <div className="space-y-2">
                      {doctor.working_days.map((day, index) => {
                          const availableSlots = doctor.slots[index] || 0;

                          if (availableSlots === 0) return null;

                          const isSelected = day === selectedDay;

                          return (
                              <div key={index} className="doctorDetails-working-days">
                                  <div
                                      className={`doctorDetails-selectedDay ${isSelected ? 'selectedDay' : ''}`}
                                      onClick={() => setSelectedDay(day)}
                                  >
                                      {day}
                                  </div>
                                  <div className="doctorDetails-slots">{availableSlots} Slots</div>
                              </div>
                          );
                      })}

                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No available days</p>
                )}

                {/* Book Appointment Button */}
                <button
                    className="mt-4 px-6 py-2 btn btn-primary text-dark rounded-md hover:bg-gray-700 transition"
                    disabled={!selectedDay}
                    onClick={() => handleClick()}
                >
                    Book Appointment
                </button>

            </div>
        </div>
    );
};

export default DoctorDetail;
