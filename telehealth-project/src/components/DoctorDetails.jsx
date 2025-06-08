import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './DoctorDetails.css';

const DoctorDetail = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentWeekSlots, setCurrentWeekSlots] = useState([]);
    const navigate = useNavigate();

    
    const fetchDoctorData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/doctors/${id}`);
            setDoctor(response.data);
            // const { working_days, slots } = response.data;
            // setDoctor({ ...response.data, working_days, slots });
            
            const weeklyResponse = await axios.get(`http://127.0.0.1:8000/api/doctor/weekly-slots/${id}`);
            const currentWeek = weeklyResponse.data.currentWeek;
            
            setCurrentWeekSlots(currentWeek);
        } catch (error) {
            console.error("Error fetching doctor:", error.response?.data || error.message);
        }
    };
    
    useEffect(() => {
        fetchDoctorData();
    }, [id]);
    
    const handleClick = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && selectedDay && selectedDate) {
            const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
            navigate(`/book-appointment/${doctor.id}/${selectedDay}/${formattedDate}`);
        } else {
            navigate("/login");
        }
    };

    const isDayMatch = (date) => {
        if (!selectedDay) return false;
        const today = new Date();
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const slotMatch = currentWeekSlots.find(slot => {
            const slotDate = new Date(slot.date);
            return (
                dayName === selectedDay &&
                slotDate.toDateString() === date.toDateString() &&
                slot.availableSlots > 0
            );
        });
        return slotMatch && date >= today;
    };

    if (!doctor) {
        return <h2 className="text-center text-red-600 text-2xl">Doctor not found</h2>;
    }

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
                <p className="text-gray-500">Opening Hours: {doctor.opening_hours}</p>
                <p className="text-gray-500">Closing Hours: {doctor.closing_hours}</p>

                {/* Working Days */}
                {doctor.working_days?.map((day, index) => {
                    const daySlots = currentWeekSlots.filter(slot => slot.day === day);
                    const totalAvailableSlots = daySlots.reduce((sum, s) => sum + s.availableSlots, 0);
                    const totalMaxSlots = doctor.slots[index] ?? 0;

                    const isDisabled = totalAvailableSlots === 0;

                    return (
                        <div key={index} className="doctorDetails-working-days">
                            <div
                                className={`doctorDetails-selectedDay ${day === selectedDay ? 'selectedDay' : ''} ${isDisabled ? 'disabledDay' : ''}`}
                                onClick={() => {
                                    if (!isDisabled) {
                                        setSelectedDay(day);
                                        setSelectedDate(null);
                                    }
                                }}
                                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.6 : 1 }}
                            >
                                {day}
                            </div>
                            <div className="doctorDetails-slots">
                                {totalAvailableSlots} Slots (of {totalMaxSlots})
                            </div>
                        </div>
                    );
                })}


                {/* Calendar (Date Picker) */}
                {selectedDay && currentWeekSlots.some(slot => slot.day === selectedDay && slot.availableSlots > 0) && (
                    <div className="mt-4">
                        <label className="text-gray-700 font-semibold">Select a {selectedDay}:</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            filterDate={isDayMatch}
                            placeholderText={`Select a ${selectedDay}`}
                            minDate={new Date()}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md"
                        />
                    </div>
                )}


                {/* Book Appointment */}
                <button
                    className="mt-4 px-6 py-2 btn btn-primary text-dark rounded-md hover:bg-gray-700 transition"
                    disabled={!selectedDay || !selectedDate}
                    onClick={handleClick}
                >
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default DoctorDetail;
