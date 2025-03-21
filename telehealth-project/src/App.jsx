import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import CustomNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./screens/Home";
import About from "./screens/About";
import Doctors from "./screens/Doctors";
import Services from "./screens/Services";
import Dashboard from "./screens/Dashboard";
import DoctorDetail from './components/DoctorDetails';
import Login from './screens/Login';
import Signup from './screens/Signup';
import TermsAndConditions from './screens/TermsAndConditions';
import AddDoctor from './screens/AddDoctor';
import DoctorList from './screens/DoctorList';
import EditDoctor from './screens/EditDoctor';
import Patients from './screens/Patients';
import Appointments from './screens/Appointments';
import Checkup from './screens/Checkup';
import PatientAppointmentDetails from './screens/PatientAppointmentDetails';
import Profile from './screens/Profile';
import "./App.css";

const App = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/signup", "/signup/terms&conditions"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);
  
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/signup/terms&conditions' element={<TermsAndConditions />}></Route>
      </Routes>
        
      <div className='d-flex'>
        {!shouldHideSidebar && <Sidebar />}
        <div className="content w-100">
          {!shouldHideSidebar && <CustomNavbar />}
          <div className="main-content mt-2 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/services" element={<Services />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/dashboard/add" element={<AddDoctor />} />
              <Route path="/dashboard/doctors" element={<DoctorList />} />
              <Route path="/dashboard/doctors/edit/:id" element={<EditDoctor />} />
              <Route path='/patients' element={<Patients />} />
              <Route path='/appointments' element={<Appointments />} /> 
              <Route path='/appointments/detail/:id' element={<Checkup />} /> 
              <Route path='/patients/detail/:id' element={<PatientAppointmentDetails/>}></Route>
              <Route path='/profile/:id' element={<Profile/>}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
