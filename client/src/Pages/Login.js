import React, { useState } from "react";
import "./Pages.css";

function Login({ setPage }) {
  const [Username, setUsername] = useState("");
  const [Password, setPassWord] = useState("");

  const handleClickLogin = (UserData) => {
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
    setPage("Profile");
  };

  const handleClickSignUp = () => {
    setPage("SignUp");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const UserData = {
      Username,
      Password,
    };
    handleClickLogin(UserData);
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
        <button type="submit" id="Loginclick">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
