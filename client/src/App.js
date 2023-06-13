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
      .then(response => {
        setLoggedIn(response.data.loggedIn);
        console.log("inside useeffect change")
        console.log(loggedIn)
      })
      .catch(error => {
        console.error('Error checking login state', error);
      });
  }, []);

  const handleSessionChange= (value) => {
    setLoggedIn(value);
    console.log("inside handle change")
    console.log(loggedIn)
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

  console.log(loggedIn)

  return (
    <div className="App">
      {!loggedIn && Page === "" && <IntroPage setPage={setPage} />}
      {!loggedIn &&Page === "SignUp" && <SignUp setPage={setPage} />}
      {!loggedIn &&Page === "Login" && <Login setPage={setPage} sessionStatus={handleSessionChange} />}
      {!loggedIn &&Page === "Forget" && <ForgetPasswordPage setPage={setPage} />}
      {loggedIn &&Page === "Profile" && <Profile setPage={setPage} sessionStatus={handleLogout}/>}
    </div>
  );
};

/*
function App() {
  const [state, setState] = useState("SignUp"); //debug use for default setting signup page

  const [user, setuser] = useState({});

  const handleClickSignUp = () => {
    setState("SignUp");
  };
  const SignInClicked = () => {
    setState("Login");
  };
  const handleClickAlreadySignUp = () => {
    setState("Login");
  };
  const handleClickForget = () => {
    setState("Forget");
  };
  const handleUserSignUp = (inputData) => {
    setuser(inputData);
    setState("profile");

    console.log("success");

    fetch("http://localhost:8080/user", {
      method: "POST", //communicate to backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleClickLogin = (UserData) => {
    setuser(UserData);
    setState("profile");

    fetch("http://localhost:8080/Profile", {
      method: "POST", //communicate to backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(UserData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="App">
      {state === "Intro" && (
        <IntroPage
          signupClicked={handleClickSignUp}
          SignInClicked={SignInClicked}
          forgetClicked={handleClickForget}
        />
      )}
      {state === "SignUp" && (
        <Signup
          alreadysignclick={handleClickAlreadySignUp}
          submitSignclick={handleUserSignUp}
        />
      )}
      {state === "Login" && (
        <Login
          ClickLogin={handleClickLogin}
          SignupClicked={handleClickSignUp}
        />
      )}
      {state === "profile" && <Profile user={user} />}
      {state === "Forget" && <ForgetPasswordPage />}
    </div>
  ); //the al-signup is temperaily change to intro page now
}
*/

export default App;
