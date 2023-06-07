import React,{useState} from 'react';
import './Login.css'

function Login({ClickLogin,SignupClicked}){
    const [Username, setUsername] = useState("");
    const [Password, setPassWord] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        const UserData = {
            Username,
            Password
          };
        ClickLogin(UserData);
      };

    return(
        <div>
            <h1>Daily Task Assistant</h1>
            <form id="loginForm" onSubmit={handleLogin}>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)}/><br/>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassWord(e.target.value)}/><br/>
            <u onClick={SignupClicked}>Need to Sign Up? Click Here</u>
            <button type="submit" id='Loginclick'>Login</button>
            </form>
        </div>
    );
}

export default Login;