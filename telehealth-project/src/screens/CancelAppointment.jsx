import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import './CancelAppointment.css';

const CancelAppointment = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [remarks, setRemarks] = useState("");
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchAppointmentData();
    }, [id]);

    const fetchAppointmentData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/appointments/${id}`);
            setAppointment(response.data);
            // console.log(response.data);
        } catch (error) {
            console.error("Appointment fetch failed:", error.response?.data || error.message);
        }
    };

    const handleCancelProcessed = async () => {
        const confirmCancel = window.confirm("You want to cancel this Appointment?");
        if (!confirmCancel) {
            return; // Don't proceed if user cancels the dialog
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/appointments/cancel/${id}`, // 👈 Make sure endpoint is correct
                {
                    remarks: remarks,
                    performed_by: user.id,
                    performed_by_role: userRole
                }
            );

            alert("Appointment cancelled successfully!");
            navigate("/appointments");

        } catch (error) {
            console.error("Cancellation Error:", error.response?.data || error.message);
            alert("Failed to cancel appointment: " + (error.response?.data?.error || error.message));
        }
    };


    if (!appointment || !appointment.patient || !appointment.doctor) {
        return <p>Loading...</p>;
    }

    return (
        <div className="reschedule-parent-container">
            <h1 className="text-center">Cancel Patient Appointment</h1>
            <div className="reschedule-child-container">
                <img src={appointment.doctor.image} alt={appointment.doctor.name} className="doctorDetails-image-container" />
                <div className="doctorDetails-details-container">
                    <h2 className="text-3xl font-bold">{appointment.doctor.name}</h2>
                    <p>{appointment.doctor.specialization}</p>
                    <p>Opening Hours: {appointment.doctor.opening_hours}</p>
                    <p>Closing Hours: {appointment.doctor.closing_hours}</p>
                    <p><strong>Patient:</strong> {appointment.patient.name}</p>
                    <p><strong>Original Date:</strong> {appointment.appointment_date}</p>
                    <p><strong>Status:</strong> {appointment.appointment_status}</p>

                    <label className="reschedule-label">
                        Remarks:
                        <textarea 
                            placeholder="Enter reason for cancelling..."
                            value={remarks} 
                            onChange={(e) => setRemarks(e.target.value)} 
                            rows={4} 
                            className="reschedule-remarks" 
                        />
                    </label>

                    {/* Continue Button */}
                    <button
                        className="mt-4 px-6 py-2 btn btn-primary text-dark rounded-md hover:bg-gray-700 transition"
                        disabled={!remarks}
                        onClick={handleCancelProcessed}
                    >
                        Continue
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CancelAppointment;




// second UI to display the details
//  <div className="patientAppointmentDetails-container">
//             <h1>Reschedule Patient Appointment</h1>

//             <p><strong>Appointment Scheduler Name:</strong> {appointment.patient.name}</p>
//             <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
//             <p><strong>Appointment Status:</strong> {appointment.appointment_status}</p>
//             <p><strong>Doctor Name:</strong> {appointment.doctor.name}</p>

//              {/* Available Days  */}
//                 {appointment.doctor.working_days && appointment.doctor.working_days.length > 0 ? (
//                   <div className="mt-4">
//                     <label className="text-gray-700 font-semibold">Select a new day:</label>
//                     <div className="space-y-2">
//                       {appointment.doctor.working_days.map((day, index) => {
//                         // Split the slots string and find the corresponding slot count for the current day
//                         const slotsArray = appointment.doctor.slots; // Split the slots string by space
//                         const availableSlots = parseInt(slotsArray[index]) || 0; // Get the corresponding slot for this day

//                         // Skip days with 0 available slots
//                         if (availableSlots === 0) return null;

//                         // Apply a class if the day is selected
//                         const isSelected = day === selectedDay;

//                         return (
//                           <div key={index} className="doctorDetails-working-days">
//                             <div
//                               className={`doctorDetails-selectedDay ${isSelected ? 'selectedDay' : ''}`}
//                               onClick={() => setSelectedDay(day)} // Set selected day on click
//                             >
//                               {day}
//                             </div>
//                             <div className="doctorDetails-slots">{availableSlots} Slots</div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 mt-2">No available days</p>
//                 )}

//                 {/* Book Appointment Button */}
//                 {/* <ButtonComponent text="Book Appointment" className="book-appointment-button" disabled={!selectedDay}
//                     onClick={() => handleClick()}/> */}
//                     <button
//                         className="mt-4 px-6 py-2 btn btn-primary text-dark rounded-md hover:bg-gray-700 transition"
//                         disabled={!selectedDay}
//                         onClick={() => handleClick()}
//                     >
//                         Book Appointment
//                     </button>

//         </div>