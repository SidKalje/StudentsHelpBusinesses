import "./App.css";
import LoginPage from "./components/auth/Login";
import RegisterPage from "./components/auth/RegisterStudent";
import HomePage from "./components/dashboard/HomePage";
import AboutPage from "./components/dashboard/About";
import CreateListing from "./components/dashboard/CreateListing";
import EditProfile from "./components/dashboard/EditProfile";
import ViewStarredListings from "./components/dashboard/ViewStarredListings";
import JobDetails from "./components/dashboard/JobDetails";
import ViewListings from "./components/dashboard/ViewCreatedListings";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  isLoggedIn,
  UserUID,
  UserEmail,
  UserDisplayName,
  isUserStudent,
} from "./AuthContext";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userUID, setUserUID] = useState({});
  const [userEmail, setUserEmail] = useState({});
  const [userDisplayName, setUserDisplayName] = useState({});
  const [userStudent, setUserStudent] = useState({});
  console.log(import.meta.env.VITE_APP_BASE_URL);
  return (
    <>
      <isUserStudent.Provider value={{ userStudent, setUserStudent }}>
        <isLoggedIn.Provider value={{ loggedIn, setLoggedIn }}>
          <UserUID.Provider value={{ userUID, setUserUID }}>
            <UserEmail.Provider value={{ userEmail, setUserEmail }}>
              <UserDisplayName.Provider
                value={{ userDisplayName, setUserDisplayName }}
              >
                <Router>
                  <Routes>
                    <Route path="/" Component={HomePage} />
                    <Route path="/signup" Component={RegisterPage} />
                    <Route path="/login" Component={LoginPage} />
                    <Route path="/about" Component={AboutPage} />
                    <Route path="/createlisting" Component={CreateListing} />
                    <Route path="/job/:id" Component={JobDetails} />
                    <Route path="/editprofile" Component={EditProfile} />
                    <Route
                      path="/viewlistings"
                      Component={ViewStarredListings}
                    />
                    <Route
                      path="/viewcreatedlistings"
                      Component={ViewListings}
                    />
                  </Routes>
                </Router>
              </UserDisplayName.Provider>
            </UserEmail.Provider>
          </UserUID.Provider>
        </isLoggedIn.Provider>
      </isUserStudent.Provider>
    </>
  );
}

export default App;
