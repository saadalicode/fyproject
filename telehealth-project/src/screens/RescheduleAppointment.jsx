import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import appointmentData from "../data/appointments";
import doctorData from "../data/doctors";
import './RescheduleAppointment.css';
import ButtonComponent from "../components/ButtonComponent";

const RescheduleAppointment = () => {
    const { id } = useParams(); // Get appointment ID from URL
    const [doctor, setDoctor] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");

    useEffect(() => {
        const doctorData = jsonData.find((doc) => doc.id === parseInt(id));
        if (doctorData) {
            setDoctor(doctorData);
        }
    }, [id]);

    const navigate = useNavigate();

    const handleRescheduleAppointment = () => {
        alert("reschedule Appointment clicked");
        // navigate(`/patients/detail/reschedule/${appointment.appointment_id}`);
    }

    if (!doctor) {
        return <h2 className="text-center text-red-600 text-2xl">Doctor not found</h2>;
    }

    return (
        <div className="doctorDetails-container">
             <img
                src={`/assets/images/doctors/${doctor.image}`} 
                alt={`${doctor.name} Image`}
                className="doctorDetails-image-container"
            />
            <div className="doctorDetails-details-container">
                <h1 className="text-3xl font-bold text-gray-800 mt-4">{doctor.name}</h1>
                <p className="text-lg text-gray-600">{doctor.specialization}</p>
                <p className="text-gray-500">Experience: {doctor.experience} years</p>
                <p className="text-green-600 font-bold">Price: ${doctor.price}</p>
                <p className="text-gray-500">Available Slots: {doctor.slots}</p>
                <p className="text-gray-500">Opening Hours: {doctor.opening_hours}</p>
                <p className="text-gray-500">Closing Hours: {doctor.closing_hours}</p>

                {/* Available Days Dropdown */}
                {doctor.working_days && doctor.working_days.length > 0 ? (
                    <div className="mt-4">
                        <label className="text-gray-700 font-semibold">Select a day:</label>
                        <select
                                className="border p-2 rounded-md ml-2"
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                        >
                                <option value="">Choose a day</option>
                                {doctor.working_days.map((day, index) => (
                                    <option key={index} value={day}>{day}</option>
                                ))}
                        </select>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2">No available days</p>
                )}

                {/* Book Appointment Button */}
                <ButtonComponent text="Reschedule Appointment" className="reschedule-button" onClick={handleRescheduleAppointment} />
                <button
                    className="mt-4 px-6 py-2 btn btn-primary text-dark rounded-md hover:bg-gray-700 transition"
                    disabled={!selectedDay}
                    onClick={() => handleClick()}
                >
                    Reschedule Appointment
                </button>

            </div>
        </div>
    );
};

export default RescheduleAppointment;
