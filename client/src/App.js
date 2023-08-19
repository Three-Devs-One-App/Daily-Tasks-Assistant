import React from "react";
import { useState,useEffect} from "react";
import IntroPage from "./Pages/Intro.js";
import SignUp from "./Pages/SignUp.js";
import Login from "./Pages/Login.js";
import Profile from "./Pages/Profile.js";
import ForgetPasswordPage from "./Pages/ForgetPasswordPage.js";
import Task from "./Pages/Task.js"
import "./App.css";

const App = () => {
  const [Page, setPage] = useState("");

  const [loggedIn,setLoggedIn] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/check-login',{ credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setLoggedIn(data.loggedIn);
        console.log(data.loggedIn)
        console.log("inside useeffect change")
      })
      .catch(error => {
        console.error('Error checking login state', error);
      });
  }, [Page]);

  const handleSessionChange= (value) => {
    setLoggedIn(value);
  };


  return (
    <div className="App">
      {!loggedIn && Page === "" && <IntroPage setPage={setPage} />}
      {!loggedIn &&Page === "SignUp" && <SignUp setPage={setPage} />}
      {!loggedIn &&Page === "Login" && <Login setPage={setPage} sessionStatus={handleSessionChange} />}
      {!loggedIn &&Page === "ForgetPassword" && <ForgetPasswordPage setPage={setPage} />}
      {(loggedIn &&(Page === "Profile"||Page==="")) && <Profile setPage={setPage} setLoggedIn={setLoggedIn}/>}
      {(loggedIn &&Page === "Task") && <Task setPage={setPage}/>}
    </div>
  );
};

export default App;
