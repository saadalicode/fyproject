import React from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { FaUserCircle, FaSearch } from "react-icons/fa";

const CustomNavbar = () => {
  const location = useLocation();
  
  // Get the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.startsWith("/doctors/")) {
      return "Doctor Details"; // Handles dynamic doctor detail pages
    }
    else if(path.startsWith("/dashboard/doctors/edit/")) {
      return "Edit Doctor";
    }
    else if(path.startsWith("/appointments/detail/")) {
      return "Check Up";
    }
    else if(path.startsWith("/patients/detail/")) {
      return "Appointment Details";
    }
    else if(path.startsWith("/profile/")) {
      return "Profile";
    }

    switch (path) {
      case "/":
        return "Home";
      case "/about":
        return "About";
      case "/doctors":
        return "Doctors";
      case "/services":
        return "Services";
      case "/patients":
        return "Appointments";
      case "/appointments":
        return "Patient Appointments";
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/add":
        return "Add New Doctor";
      case "/dashboard/doctors":
        return "Existing Doctors";
      default:
        return "Page";
    }
  };

  return (
    <Navbar  expand="lg" variant="dark" className="px-3 navbar">
      <Navbar.Brand className="fw-bold">{getPageTitle()}</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Form className="d-flex ms-auto">
          <FormControl type="text" placeholder="Search" className="me-2" />
          <button className="btn btn-outline-light">
            <FaSearch />
          </button>
        </Form>
        <Nav className="ms-3">
          <NavDropdown title={<FaUserCircle size={24} />} align="end">
            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
