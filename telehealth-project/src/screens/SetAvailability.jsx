import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ButtonComponent from "../components/ButtonComponent";
import '../components/DoctorDetails.css';
import '../screens/SetAvailability.css';

const SetAvailability = () => {
    const [doctor, setDoctor] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentWeekSlots, setCurrentWeekSlots] = useState([]);
    const [blockedDates,    setBlockedDates]    = useState([]);  
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
     /* --------------- helpers --------------- */
    const ymd = (d) => {
      const year = d.getFullYear();
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const day = (`0${d.getDate()}`).slice(-2);
      return `${year}-${month}-${day}`;
    };
            // YYYY‑MM‑DD
    // console.log(user);
    const fetchDoctorData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/doctors/${user.id}`);
            setDoctor(response.data);
            // const { working_days, slots } = response.data;
            // setDoctor({ ...response.data, working_days, slots });
            
            const weeklyResponse = await axios.get(`http://127.0.0.1:8000/api/doctor/weekly-slots/${user.id}`);
            const currentWeek = weeklyResponse.data.currentWeek;
            
            setCurrentWeekSlots(currentWeek);
            const { data: bd } = await axios.get(
              `http://127.0.0.1:8000/api/doctor/${user.id}/blocked-dates`
            );
            setBlockedDates(bd);   // bd is an array like ["2025‑06‑07","2025‑06‑15"]

        } catch (error) {
            console.error("Error fetching doctor:", error.response?.data || error.message);
        }
    };

    
    useEffect(() => {
        fetchDoctorData();
    }, []);

    const isDayMatch = (date) => {
        if (!selectedDay) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const slotMatch = currentWeekSlots.find(slot => {
            const slotDate = new Date(slot.date);
            return (
                dayName === selectedDay &&
                slotDate.toDateString() === date.toDateString() 
            );
        });
        return slotMatch && date >= today;
    };

    /* --------------- block / unblock --------------- */
    const toggleBlock = async () => {
      if (!selectedDate) return;
      const dateStr  = ymd(selectedDate);
      const baseUrl  = `http://127.0.0.1:8000/api/doctor/${doctor.id}/blocked-dates`;

      try {
        if (blockedDates.includes(dateStr)) {
          /* ---------- UN‑BLOCK ---------- */
          await axios.delete(`${baseUrl}/${dateStr}`);
          alert("Date unblocked.");
        } else {
          /* ---------- BLOCK ---------- */
          await axios.post(baseUrl, { date: dateStr, day: selectedDay });
          alert("Date blocked and pending appointments (if any) cancelled.");
        }
        await fetchDoctorData();                  // refresh state
        setSelectedDate(null);             // reset picker
      } catch (err) {
        console.error("Block toggle failed:", err);
        alert("Operation failed – please try again.");
      }
    };


    if (!doctor) {
        return <h2 className="text-center text-red-600 text-2xl">Doctor not found</h2>;
    }

    return (
        <div className="doctorDetails-container">
            <div className="doctorDetails-details-container">

                {/* Working Days */}
                {doctor.working_days.map((day, i) => {
                  const daySlots   = currentWeekSlots.filter((s) => s.day === day);
                  const freeSlots  = daySlots.reduce((sum, s) => sum + s.availableSlots, 0);
                  const maxSlots   = doctor.slots[i] ?? 0;

                  return (
                    <div key={day} className="doctorDetails-working-days">
                      <div
                        className={`doctorDetails-selectedDay ${
                          day === selectedDay ? "selectedDay" : ""
                        }`}
                        onClick={() => {
                          setSelectedDay(day);
                          setSelectedDate(null);
                        }}
                      >
                        {day}
                      </div>
                      <div className="doctorDetails-slots">
                        {freeSlots} Slots (of {maxSlots})
                      </div>
                    </div>
                  );
                })}

                {/* ---------- Date‑picker ---------- */}
                {selectedDay && (
                  <div className="mt-4">
                    <label className="text-gray-700 font-semibold">
                      Select a {selectedDay}:
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={setSelectedDate}
                      filterDate={isDayMatch}
                      placeholderText={`Pick the upcoming ${selectedDay}`}
                      dateFormat="yyyy-MM-dd"
                      className="p-2 border rounded-md"
                      minDate={new Date()}
                    />
                  </div>
                )}
                        {/* ---------- Block / Unblock button ---------- */}
                {selectedDate && (
                  <ButtonComponent
                    className={`setAvailability-button ${
                      blockedDates.includes(ymd(selectedDate))
                        ? "setAvailability-unBlock-button"
                        : "setAvailability-block-button"
                    }`}
                    onClick={toggleBlock}
                    text={blockedDates.includes(ymd(selectedDate))
                      ? "Un‑block This Date"
                      : "Block This Date"}
                  />
                )}

            </div>
        </div>
    );
};

export default SetAvailability;
