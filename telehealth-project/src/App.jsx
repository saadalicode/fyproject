import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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
import DoctorRegister from './screens/DoctorRegister';
import TermsAndConditions from './screens/TermsAndConditions';
import AddDoctor from './screens/AddDoctor';
import DoctorList from './screens/DoctorList';
import EditDoctor from './screens/EditDoctor';
import Patients from './screens/Patients';
import Appointments from './screens/Appointments';
import Checkup from './screens/Checkup';
import PatientAppointmentDetails from './screens/PatientAppointmentDetails';
import Profile from './screens/Profile';
import Setting from './screens/Setting';
import CheckupSumbit from './screens/CheckupSubmit';
import RescheduleAppointment from './screens/RescheduleAppointment';
import CancelAppointment from './screens/CancelAppointment';
import BookAppointment from './screens/BookAppointment';
import ReviewRescheduleAppointment from './screens/ReviewRescheduleAppointment';
import DoctorRegisterRequest from './screens/DoctorRegisterRequest';
import ReviewRegisterRequest from './screens/ReviewRegisterRequest';
import RegisteredUsers from './screens/RegisteredUsers';
import AllDoctors from './screens/AllDoctors';
import AllPatients from './screens/AllPatients';
import PatientsList from './screens/PatientsList';
import EditPatient from './screens/EditPatient';
import SetAvailability from './screens/SetAvailability';
import PaymentPage from './screens/PaymentPage';
import "./App.css";

const App = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/signup", "/signup/terms&conditions", "/doctor/signup"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);
  
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctor/signup" element={<DoctorRegister />} />
        <Route path='/signup/terms&conditions' element={<TermsAndConditions />}></Route>
      </Routes>
        
      <div className='d-flex'>
        {!shouldHideSidebar && <Sidebar />}
        <div className="content w-100">
          {!shouldHideSidebar && <CustomNavbar />}
          <div className="main-content mt-2 p-4">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/schedule" element={<SetAvailability />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/book-appointment/:id/:day/:date" element={<BookAppointment />} />
              <Route path="/pay" element={<PaymentPage />} />
              {/* <Route path="/payment-success" element={<PaymentSuccess />} /> */}


              <Route path='/dashboard/users' element={<RegisteredUsers/>} />
              <Route path='/dashboard/users/doctors' element={<AllDoctors/>} />
              <Route path='/dashboard/users/patients' element={<AllPatients/>} />
              <Route path='/dashboard/patients' element={<PatientsList/>} /> 
              <Route path='/dashboard/patients/edit/:id' element={<EditPatient/>} /> 
    
              {/* Role-based pages */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>} 
              />
              <Route path="/dashboard/add" element={<AddDoctor />} />
              <Route path="/dashboard/doctors" element={<DoctorList />} />
              <Route path="/dashboard/request" element={<DoctorRegisterRequest />} />
              <Route path="/dashboard/request/review/:id" element={<ReviewRegisterRequest />} />
              <Route path="/dashboard/doctors/edit/:id" element={<EditDoctor />} />

              <Route path='/patients' element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <Patients /> 
                </ProtectedRoute>}
              />
              <Route path='/appointments' element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <Appointments />
                </ProtectedRoute>} 
              /> 
              <Route path='/appointments/detail/:id' element={<Checkup />} /> 
              <Route path='/appointments/detail/finalize/:id' element={<CheckupSumbit />} /> 
              <Route path='/patients/detail/:id' element={<PatientAppointmentDetails/>}></Route>
              <Route path='/patients/detail/reschedule/:id' element={<RescheduleAppointment/>}></Route>
              <Route path='/patients/detail/cancel/:id' element={<CancelAppointment/>}></Route>
              <Route path='/patients/detail/review-reschedule/' element={<ReviewRescheduleAppointment/>}></Route>
              <Route path='/profile/:id' element={
                <ProtectedRoute allowedRoles={["patient", "doctor", "admin"]}>
                  <Profile/>
                </ProtectedRoute>}
              />
              <Route path='/setting/:id' element={<Setting/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
