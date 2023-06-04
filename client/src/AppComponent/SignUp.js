import React from 'react';
import { useState } from 'react';
import './Signup.css'
import './AppComponent.css'

function SignUp({alreadysignclick,submitSignclick}){
    const [Username, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    const [pass1, setpass1] = useState("");
    const [pass2, setpass2] = useState("");
    const [warning, setWarning] = useState("")


    const handleSubmit = (event) => {
        event.preventDefault();
        if (pass1 === pass2) {
            const inputData = {
                Username,
                Email,
                pass1
              };
            submitSignclick(inputData);
          setWarning("");
        } else {
          setWarning("Password are not equal");
        }
      };


    return(
        <div className="SignUp">
            <h1 >Daily Task Assistant</h1>
            <form id="loginForm" onSubmit={handleSubmit}>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)}/><br/>
                <label for="E-mail">E-mail:</label>
                <input type="text" id="E-mail" name="E-mail" onChange={(e) => setEmail(e.target.value)}/><br/>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setpass1(e.target.value)}/><br/>
                <label for="Re-password">Re-Password:</label>
                <input type="password" id="Re-password" name="Re-password" onChange={(e) => setpass2(e.target.value)} /><br/>
                <button type="submit" id='submitSignclick'>Sign-UP</button>
            </form>
            <button id='Already_User' onClick={alreadysignclick}>Already Sign-Up</button>
            {warning&&<p>{warning}</p>}
        </div>
    );
}

export default SignUp;