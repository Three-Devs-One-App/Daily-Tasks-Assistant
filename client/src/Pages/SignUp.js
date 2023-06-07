import React from "react";
import { useState } from "react";
import "./Pages.css";

function SignUp({ setPage }) {
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [pass1, setpass1] = useState("");
  const [pass2, setpass2] = useState("");
  const [warning, setWarning] = useState("");

  const handleClickAlreadySignUp = () => {
    setPage("Login");
  };

  const handleUserSignUp = (inputData) => {
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

    window.alert(
      "You have signed up successfully! Please sign in now with your credentials..."
    );
    setPage("Login");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!Username || !Email || !pass1 || !pass2) {
      setWarning("Please enter all required field");
    } else if (pass1 !== pass2) {
      setWarning("Please enter same password");
    } else {
      const inputData = {
        Username,
        Email,
        pass1,
      };
      handleUserSignUp(inputData);
      setWarning("");
    }
  };

  return (
    <div className="SignUp">
      <h1>Daily Task Assistant</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label for="E-mail">E-mail:</label>
        <input
          type="text"
          id="E-mail"
          name="E-mail"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => setpass1(e.target.value)}
        />
        <br />
        <label for="Re-password">Re-Password:</label>
        <input
          type="password"
          id="Re-password"
          name="Re-password"
          onChange={(e) => setpass2(e.target.value)}
        />
        <br />
        <button type="submit" id="submitSignclick">
          Sign-UP
        </button>
        <br />
        {warning && <p id="warning">{warning}</p>}
      </form>
      <button id="Already_User" onClick={handleClickAlreadySignUp}>
        Already Sign-Up
      </button>
    </div>
  );
}

export default SignUp;
