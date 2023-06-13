import React, { useState } from "react";
import "./Pages.css";

function Login({ setPage,sessionStatus}) {
  const [Username, setUsername] = useState("");
  const [Password, setPassWord] = useState("");
  const [warning, setWarning] = useState("");

  const handleClickSignUp = () => {
    setPage("SignUp");
  };
 
  const handleLogin = async(event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:8080/Login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username,
          Password
        }),
    });

    const data = await response.json();
    if (data.login === 'User Login successfully'){
      sessionStatus((currentValue) => !currentValue);
      setPage("Profile");
    }
    else{
      setWarning(data.login);
    }
  };

  return (
    <div>
      <h1>Daily Task Assistant</h1>
      <form id="loginForm" onSubmit={handleLogin}>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassWord(e.target.value)}
        />
        <br />
        <u onClick={handleClickSignUp}>Need to Sign Up? Click Here</u>
        <br />
        <button type="submit" id="Loginclick">
          Login
        </button>
        <br />
        {warning && <p id="warning">{warning}</p>}
      </form>
    </div>
  );
}

export default Login;
