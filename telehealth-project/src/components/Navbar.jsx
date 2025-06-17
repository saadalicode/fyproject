import React, {useState} from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch } from "react-icons/fa";

const CustomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // null if not logged in

const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      navigate(`/doctors?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput(""); // Optional: clear the input after navigating
    }
  };

  // Get the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/doctors/")) return "Doctor Details";
    else if (path.startsWith("/book-appointment/")) return "Book Appointment";
    else if (path.startsWith("/dashboard/doctors/edit/")) return "Edit Doctor";  
    else if (path.startsWith("/dashboard/patients/edit/")) return "Edit Patient";  
    else if (path.startsWith("/dashboard/request/review/")) return "Review Request";
    else if (path.startsWith("/appointments/detail/")) return "Check Up";
    else if (path.startsWith("/appointments/detail/finalize/")) return "Check Up Finalize";
    else if (path.startsWith("/patients/detail/reschedule/")) return "Reschedule Appointment";
    else if (path.startsWith("/patients/detail/cancel/")) return "Cancel Appointment";
    else if (path.startsWith("/patients/detail/")) return "Appointment Details";
    else if (path.startsWith("/profile/")) return "Profile";
    else if (path.startsWith("/setting/")) return "Setting";

    switch (path) {
      case "/": return "Home";
      case "/about": return "About";
      case "/doctors": return "Doctors";
      case "/services": return "Services";
      case "/schedule": return "Set Availability";
      case "/patients": return "Patient Appointments";
      case "/appointments": return "Appointments";
      case "/dashboard": return "Dashboard";
      case "/dashboard/add": return "Add New Doctor";
      case "/dashboard/doctors": return "Existing Doctors";
      case "/dashboard/patients": return "Existing Patients";
      case "/dashboard/request": return "Add Doctors Request";
      case "/dashboard/users": return "Registered Users";
      case "/dashboard/users/doctors": return "Registered Doctors";
      case "/dashboard/users/patients": return "Registered Patients";
      default: return "Page";
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
   <Navbar expand="lg" variant="dark" className="px-3 navbar">
      <Navbar.Brand className="fw-bold">{getPageTitle()}</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Form className="d-flex ms-auto" onSubmit={handleSearchSubmit}>
          <FormControl
            type="text"
            placeholder="Search by specialization or location"
            className="me-2"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="btn btn-outline-light" type="submit">
            <FaSearch />
          </button>
        </Form>
        <Nav className="ms-3">
          <NavDropdown title={<FaUserCircle size={24} />} align="end">
            <NavDropdown.Item onClick={() => navigate(`/profile/${user.id}`)}>Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={() => navigate("/setting")}>Settings</NavDropdown.Item>
            <NavDropdown.Divider />
            {!user ? (
              <NavDropdown.Item onClick={() => navigate("/login", { state: { from: location } })}>Login</NavDropdown.Item>
            ) : (
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
