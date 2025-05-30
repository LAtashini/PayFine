import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home'; 
import SignIn from './Pages/SignIn';
import AboutUs from './Pages/AboutUs'; 
import ContactUs from './Pages/ContactUs';
import Help from './Pages/Help'; 
import SignUp from './Pages/Driver/SignUp'; 
import DriverDashboard from './Pages/Driver/DriverDashboard';
import DriversPendingFine from './Pages/Driver/DriversPendingFine'; 
import DriverProfile from './Pages/Driver/DriverProfile';
import PoliceDashboard from './Pages/Police/PoliceDashboard';
import DriversPastFine from './Pages/Police/DriversPastFine'; 
import AddNewFine from './Pages/Police/AddNewFine';
import RevenueLicense from './Pages/Police/RevenueLicense'; 
import ViewReportedFine from './Pages/Police/ViewReportedFine';
import AdminSignUp from './Pages/Admin/AdminSignUp'; 
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AddPolice from './Pages/Admin/AddPolice'; 
import ViewAllPolice from './Pages/Admin/ViewAllPolice'; 
import ProvisionDetails from "./Pages/Admin/ProvisionDetails"; 
import ViewAllDrivers from './Pages/Admin/ViewAllDeivers'; 
import PaidFine from './Pages/Admin/PaidFine'; 
import PendingFine from './Pages/Admin/PendingFine'; 
import AllFine from './Pages/Admin/AllFine'; 
import DriversPaidFine from './Pages/Driver/DriversPaidFine';
import DriverProvisionDetails from './Pages/Driver/DriverProvisionDetails';
import Feedback from './Pages/Driver/Feedback';
import Notification from './Pages/Driver/Notification';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn/:role" element={<SignIn />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="ContactUs" element={<ContactUs />} />
          <Route path="/Help" element={<Help />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/DriverDashboard" element={<DriverDashboard />} />
          <Route path="/DriverProfile" element={<DriverProfile />} />
          <Route path="/DriversPaidFine" element={<DriversPaidFine />} />
          <Route path="/DriversPendingFine" element={<DriversPendingFine />} />
          <Route path="/DriverProvisionDetails" element={<DriverProvisionDetails />} />
          <Route path="/PoliceDashboard" element={<PoliceDashboard />} />
          <Route path="/DriversPastFine" element={<DriversPastFine />} />
          <Route path="/AddNewFine" element={<AddNewFine />} />
          <Route path="/RevenueLicense" element={<RevenueLicense />} />
          <Route path="/ViewReportedFine" element={<ViewReportedFine />} />
          <Route path="/AdminSignUp" element={<AdminSignUp />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/AddPolice" element={<AddPolice />} />
          <Route path="/ViewAllPolice" element={<ViewAllPolice />} />
          <Route path="/ProvisionDetails" element={<ProvisionDetails />} />
          <Route path="/ViewAllDrivers" element={<ViewAllDrivers />} />
          <Route path="/PaidFine" element={<PaidFine />} />
          <Route path="/PendingFine" element={<PendingFine />} />
          <Route path="/AllFine" element={<AllFine />} />
          <Route path="/Feedback" element={<Feedback />} />
          <Route path="/Notifications" element={<Notification />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;


