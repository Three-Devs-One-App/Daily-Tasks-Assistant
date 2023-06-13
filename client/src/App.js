import React from "react";
import { useState,useEffect} from "react";
import IntroPage from "./Pages/Intro.js";
import SignUp from "./Pages/SignUp.js";
import Login from "./Pages/Login.js";
import Profile from "./Pages/Profile.js";
import ForgetPasswordPage from "./Pages/ForgetPasswordPage.js";
import "./App.css";

const App = () => {
  const [Page, setPage] = useState("");

  const [loggedIn,setLoggedIn] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/check-login')
      .then(response => response.json())
      .then(data => {
        setLoggedIn(data.loggedIn);
        console.log("inside useeffect change")
        console.log(loggedIn) // <-- This will not reflect the updated value immediately
      })
      .catch(error => {
        console.error('Error checking login state', error);
      });
  }, []);

  const handleSessionChange= (value) => {
    setLoggedIn(value);
    console.log("inside handle change")
    console.log(value)
  };

  const handleLogout = () => {
    fetch('http://localhost:8080/Logout')
      .then(response => {
        setLoggedIn(false);
      })
      .catch(error => {
        console.error('Error logging out', error);
      });
  };

  console.log(Page)
  console.log(loggedIn)
  return (
    <div className="App">
      {!loggedIn && Page === "" && <IntroPage setPage={setPage} />}
      {!loggedIn &&Page === "SignUp" && <SignUp setPage={setPage} />}
      {!loggedIn &&Page === "Login" && <Login setPage={setPage} sessionStatus={handleSessionChange} />}
      {!loggedIn &&Page === "Forget" && <ForgetPasswordPage setPage={setPage} />}
      {(loggedIn ||Page === "Profile") && <Profile setPage={setPage} sessionStatus={handleLogout}/>}
    </div>
  );
};

export default App;
