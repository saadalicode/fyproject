import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import appointmentData from "../data/appointments";
import doctorData from "../data/doctors";
import './RescheduleAppointment.css';
import ButtonComponent from "../components/ButtonComponent";

const RescheduleAppointment = () => {
    const { id } = useParams(); // Get appointment ID from URL
    const [doctor, setDoctor] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointmentData();
    }, []);

    const fetchAppointmentData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/appointments/"+id,
              );
              console.log(" successful:", response.data);
              setAppointment(response.data);
        } catch (error) {
            console.error(" failed:", error.response?.data || error.message);
          }
    }

    // useEffect(() => {
    //     const doctorData = jsonData.find((doc) => doc.id === parseInt(id));
    //     if (doctorData) {
    //         setDoctor(doctorData);
    //     }
    // }, [id]);


    const handleRescheduleAppointment = () => {
        alert("reschedule Appointment clicked");
        // navigate(`/patients/detail/reschedule/${appointment.appointment_id}`);
    }

    // if (!doctor) {
    //     return <h2 className="text-center text-red-600 text-2xl">Doctor not found</h2>;
    // }
    if (!appointment || !appointment.patient || !appointment.doctor ) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <div className="patientAppointmentDetails-container">
            <h1>Reschedule Patient Appointment</h1>

            <p><strong>Appointment Scheduler Name:</strong> {appointment.patient.name}</p>
            <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
            <p><strong>Appointment Status:</strong> {appointment.appointment_status}</p>
            <p><strong>Doctor Name:</strong> {appointment.doctor.name}</p>

             {/* Available Days  */}
                {appointment.doctor.working_days && appointment.doctor.working_days.length > 0 ? (
                  <div className="mt-4">
                    <label className="text-gray-700 font-semibold">Select a new day:</label>
                    <div className="space-y-2">
                      {appointment.doctor.working_days.split(' ').map((day, index) => {
                        // Split the slots string and find the corresponding slot count for the current day
                        const slotsArray = appointment.doctor.slots.split(' '); // Split the slots string by space
                        const availableSlots = parseInt(slotsArray[index]) || 0; // Get the corresponding slot for this day

                        // Skip days with 0 available slots
                        if (availableSlots === 0) return null;

                        // Apply a class if the day is selected
                        const isSelected = day === selectedDay;

                        return (
                          <div key={index} className="doctorDetails-working-days">
                            <div
                              className={`doctorDetails-selectedDay ${isSelected ? 'selectedDay' : ''}`}
                              onClick={() => setSelectedDay(day)} // Set selected day on click
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
 


            {appointment.appointment_status === "pending" && (
                <>
                
                <ButtonComponent text="Save" className="reschedule-button" onClick={()=> handleReschedule()} />
                <ButtonComponent text="Cancel" className="cancle-button" onClick={() => handleCancel()}/>
                </>
            )}
        </div>
        <div className="reschedule-parent-container">

          <h1 className="text-center">Reschedule Patient Appointment</h1>
            <div className="reschedule-child-container">
                <img
                    src={appointment.doctor.image}
                    alt={`${appointment.doctor.name} Image`}
                    className="doctorDetails-image-container"
                    />
                <div className="doctorDetails-details-container">
                    <h2 className="text-3xl font-bold text-gray-800 mt-4">{appointment.doctor.name}</h2>
                    <p className="text-lg text-gray-600">{appointment.doctor.specialization}</p>
                    {/* <p className="text-gray-500">Experience: {appointment.doctor.experience} years</p> */}
                    {/* <p className="text-green-600 font-bold">Fee: {doctor.price}</p> */}
                    {/* <p className="text-gray-500">Available Slots: {doctor.slots}</p> */}
                    <p className="text-gray-500">Opening Hours: {appointment.doctor.opening_hours}</p>
                    <p className="text-gray-500">Closing Hours: {appointment.doctor.closing_hours}</p>
                    <p><strong>Appointment Scheduler Name:</strong> {appointment.patient.name}</p>
                    <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
                    <p><strong>Appointment Status:</strong> {appointment.appointment_status}</p>

                    {/* Available Days */}
                    {appointment.doctor.working_days && appointment.doctor.working_days.length > 0 ? (
                    <div className="mt-4">
                        <label className="text-gray-700 font-semibold">Select a new day:</label>
                        <div className="space-y-2">
                        {appointment.doctor.working_days.split(' ').map((day, index) => {
                            // Split the slots string and find the corresponding slot count for the current day
                            const slotsArray = appointment.doctor.slots.split(' '); // Split the slots string by space
                            const availableSlots = parseInt(slotsArray[index]) || 0; // Get the corresponding slot for this day

                            // Skip days with 0 available slots
                            if (availableSlots === 0) return null;

                            // Apply a class if the day is selected
                            const isSelected = day === selectedDay;

                            return (
                            <div key={index} className="doctorDetails-working-days">
                                <div
                                className={`doctorDetails-selectedDay ${isSelected ? 'selectedDay' : ''}`}
                                onClick={() => setSelectedDay(day)} // Set selected day on click
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
        </div>
        </>
    );
};

export default RescheduleAppointment;
