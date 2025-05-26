import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home'; // Import the Home page
import SignIn from './Pages/SignIn';// Import the SignUp page
import AboutUs from './Pages/AboutUs'; // import aboutus page
import ContactUs from './Pages/ContactUs';// import contact us page
import Help from './Pages/Help'; // import help page
import SignUp from './Pages/Driver/SignUp'; // Import the SingUp page
import DriverDashboard from './Pages/Driver/DriverDashboard';// import the User Dshboard page
import DriversPendingFine from './Pages/Driver/DriversPendingFine'; //import Driving pending page
import DriverProfile from './Pages/Driver/DriverProfile';// import the User Profile page
import PoliceDashboard from './Pages/Police/PoliceDashboard';//import police dashboard page
import DriversPastFine from './Pages/Police/DriversPastFine'; //import drivers past fime page
import AddNewFine from './Pages/Police/AddNewFine';//import add new fines
import RevenueLicense from './Pages/Police/RevenueLicense'; // import revenue license page
import ViewReportedFine from './Pages/Police/ViewReportedFine';// import view reported fine page
import AdminSignUp from './Pages/Admin/AdminSignUp'; // import admin sign up page
import AdminDashboard from './Pages/Admin/AdminDashboard';// import admin dashboard page
import AddPolice from './Pages/Admin/AddPolice'; // import add pice officer page
import ViewAllPolice from './Pages/Admin/ViewAllPolice'; //import view all police page
import ProvisionDetails from "./Pages/Admin/ProvisionDetails"; // import Provision details page
import ViewAllDrivers from './Pages/Admin/ViewAllDeivers'; // import the view drivers page
import PaidFine from './Pages/Admin/PaidFine'; // import paid fine page
import PendingFine from './Pages/Admin/PendingFine'; //import pending fine page
import AllFine from './Pages/Admin/AllFine'; //import all fine page
import DriversPaidFine from './Pages/Driver/DriversPaidFine';
import DriverProvisionDetails from './Pages/Driver/DriverProvisionDetails';
import Feedback from './Pages/Admin/Feedback';


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

        </Routes>
      </div>
    </Router>
  );
};

export default App;


