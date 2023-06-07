import React from "react";
import { useState } from "react";
import IntroPage from './AppComponent/Intro.js';
import Signup from './AppComponent/SignUp.js';
import Profile from './AppComponent/Profile.js';
import Login from './AppComponent/Login.js'
import ForgetPasswordPage from "./AppComponent/ForgetPasswordPage/ForgetPasswordPage.js";
import './App.css'
function App() {

  const [state, setState] = useState('SignUp');//debug use for default setting signup page

  const [user,setuser] = useState({})

    const handleClickSignUp = () => {
        setState('SignUp');
      }
    const SignInClicked = () =>{
        setState('Login');
    }
    
    const handleClickForget = () =>{
        setState('Forget');
    }
    const handleUserSignUp = (inputData) => {
        setuser(inputData);
        setState('profile');

        console.log("fail but still goes in here")
        
        fetch('http://localhost:8080/user', {
          method: 'POST', //communicate to backend
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputData),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    const handleClickLogin = (UserData) =>{

        setuser(UserData);
        setState('profile');
        
        fetch('http://localhost:8080/Profile', {
          method: 'POST', //communicate to backend
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(UserData),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }


  return (
    <div className="App">
      {state === 'Intro' && <IntroPage signupClicked={handleClickSignUp} SignInClicked={SignInClicked} forgetClicked={handleClickForget}/>}
      {state === 'SignUp' && <Signup   submitSignclick={handleUserSignUp} setState={setState} />}
      {state === 'Login' && <Login ClickLogin={handleClickLogin} SignupClicked={handleClickSignUp} />}
      {state === 'profile' && <Profile user={user} />}
      {state==='Forget'&&<ForgetPasswordPage />}
    </div>
  );//the al-signup is temperaily change to intro page now
}

export default App;
