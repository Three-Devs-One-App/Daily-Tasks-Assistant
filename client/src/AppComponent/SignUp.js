import React from 'react';
import { useState } from 'react';
import './Signup.css'
import './AppComponent.css'

function SignUp({submitSignclick,setState}){
    const [Username, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    const [pass1, setpass1] = useState("");
    const [pass2, setpass2] = useState("");
    const [warning, setWarning] = useState("")
    
    const handleClickAlreadySignUp = () => {
      setState('Login');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!Username || !Email || !pass1 || !pass2) {
          //submitfail();
          setWarning("Please enter all required field");
        }else if(pass1 !==pass2){
          //submitfail();
          setWarning("Please enter same password");
        } 
        else {
          const inputData = {
            Username,
            Email,
            pass1
          };
        submitSignclick(inputData);
        setWarning("");
        }
      };


      console.log("refresh")
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
            <button id='Already_User' onClick={handleClickAlreadySignUp}>Already Sign-Up</button>
            {warning&&<p id="warning">{warning}</p>}
        </div>
    );
}

export default SignUp;