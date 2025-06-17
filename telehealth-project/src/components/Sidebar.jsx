import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaUserMd, FaBriefcaseMedical, FaTachometerAlt, FaUserInjured, FaCalendarAlt, FaRegCalendarPlus } from "react-icons/fa";

const Sidebar = () => {
  const role = localStorage.getItem("role");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>TeleHealth</h3>
      </div>
      <ul className="sidebar-links">

        {/* Pages visible to everyone */}
        <li><Link to="/"><FaHome /> Home</Link></li>
        <li><Link to="/about"><FaInfoCircle /> About</Link></li>
        <li><Link to="/doctors"><FaUserMd /> Doctors</Link></li>
        <li><Link to="/services"><FaBriefcaseMedical /> Services</Link></li>

        {/* Visible to patients only */}
        {role === "patient" && (
          <>
            <li><Link to="/appointments"><FaCalendarAlt /> Appointments</Link></li>
          </>
        )}

        {/* Visible to doctors only */}
        {role === "doctor" && (
          <>  
            <li><Link to="/patients"><FaCalendarAlt /> Patients</Link></li>
            <li><Link to="/schedule"><FaRegCalendarPlus /> Set Availability</Link></li>
          </>
        )}

        {/* Visible to admins only */}
        {role === "admin" && (
          <>
            <li><Link to="/dashboard"><FaTachometerAlt /> Dashboard</Link></li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
